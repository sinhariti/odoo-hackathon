const { StockPicking, StockMove, StockQuant, Product, Location, User, sequelize } = require('../models');
const { Op } = require('sequelize');

const pickingIncludes = [
    { model: Location, as: 'srcLocation', attributes: ['id', 'name', 'type'] },
    { model: Location, as: 'destLocation', attributes: ['id', 'name', 'type'] },
    { model: User, as: 'createdBy', attributes: ['id', 'name', 'email'] },
    {
        model: StockMove,
        as: 'moves',
        include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'sku', 'uom'] }],
    },
];

// ── Generic list ──────────────────────────────────────────────────────────────
const listPickings = (type) => async (req, res) => {
    try {
        const { status, startDate, endDate, supplierId, warehouseId } = req.query;
        const where = { type };
        if (status) where.status = status;
        if (startDate || endDate) {
            where.scheduledDate = {};
            if (startDate) where.scheduledDate[Op.gte] = new Date(startDate);
            if (endDate) where.scheduledDate[Op.lte] = new Date(endDate);
        }
        const pickings = await StockPicking.findAll({
            where,
            include: pickingIncludes,
            order: [['createdAt', 'DESC']],
        });
        res.json({ [type === 'receipt' ? 'receipts' : type === 'delivery' ? 'deliveries' : 'transfers']: pickings });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ── Create draft ──────────────────────────────────────────────────────────────
const createPicking = (type) => async (req, res) => {
    try {
        const { supplierName, customerName, srcLocationId, destLocationId, scheduledDate } = req.body;
        const picking = await StockPicking.create({
            type,
            status: 'draft',
            supplierName,
            customerName,
            srcLocationId,
            destLocationId,
            scheduledDate,
            createdById: req.user.id,
        });
        res.status(201).json({ picking });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ── Get single ────────────────────────────────────────────────────────────────
const getPicking = async (req, res) => {
    try {
        const picking = await StockPicking.findByPk(req.params.id, { include: pickingIncludes });
        if (!picking) return res.status(404).json({ error: 'Not found' });
        res.json({ picking });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ── Update header ─────────────────────────────────────────────────────────────
const updatePicking = async (req, res) => {
    try {
        const picking = await StockPicking.findByPk(req.params.id);
        if (!picking) return res.status(404).json({ error: 'Not found' });
        if (picking.status === 'done') return res.status(400).json({ error: 'Cannot update a done picking' });
        await picking.update(req.body);
        res.json({ picking });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ── Delete draft ──────────────────────────────────────────────────────────────
const deletePicking = async (req, res) => {
    try {
        const picking = await StockPicking.findByPk(req.params.id);
        if (!picking) return res.status(404).json({ error: 'Not found' });
        if (picking.status !== 'draft') return res.status(400).json({ error: 'Only draft pickings can be deleted' });
        await picking.destroy();
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ── Add line ──────────────────────────────────────────────────────────────────
const addLine = async (req, res) => {
    try {
        const picking = await StockPicking.findByPk(req.params.id);
        if (!picking) return res.status(404).json({ error: 'Picking not found' });
        if (picking.status === 'done' || picking.status === 'cancelled')
            return res.status(400).json({ error: 'Cannot add lines to a completed/cancelled picking' });

        const { productId, demandQty } = req.body;
        if (!productId || !demandQty) return res.status(400).json({ error: 'productId and demandQty required' });

        const move = await StockMove.create({
            pickingId: picking.id,
            productId,
            srcLocationId: picking.srcLocationId,
            destLocationId: picking.destLocationId,
            demandQty,
            doneQty: 0,
            status: 'draft',
        });
        res.status(201).json({ move });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ── Update line ───────────────────────────────────────────────────────────────
const updateLine = async (req, res) => {
    try {
        const move = await StockMove.findOne({
            where: { id: req.params.lineId, pickingId: req.params.id },
        });
        if (!move) return res.status(404).json({ error: 'Line not found' });
        if (move.status === 'done') return res.status(400).json({ error: 'Cannot update a done line' });
        await move.update(req.body);
        res.json({ move });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ── Delete line ───────────────────────────────────────────────────────────────
const deleteLine = async (req, res) => {
    try {
        const move = await StockMove.findOne({
            where: { id: req.params.lineId, pickingId: req.params.id },
        });
        if (!move) return res.status(404).json({ error: 'Line not found' });
        await move.destroy();
        res.json({ message: 'Line removed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ── Validate ──────────────────────────────────────────────────────────────────
const validatePicking = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const picking = await StockPicking.findByPk(req.params.id, {
            include: [{ model: StockMove, as: 'moves' }],
            transaction: t,
        });
        if (!picking) { await t.rollback(); return res.status(404).json({ error: 'Not found' }); }
        if (picking.status === 'done') { await t.rollback(); return res.status(400).json({ error: 'Already done' }); }
        if (picking.status === 'cancelled') { await t.rollback(); return res.status(400).json({ error: 'Cancelled picking cannot be validated' }); }

        for (const move of picking.moves) {
            // Strict check: doneQty MUST equal demandQty
            if (move.doneQty < move.demandQty) {
                await t.rollback();
                return res.status(400).json({ error: `Validation failed: Product ID ${move.productId} is missing ${move.demandQty - move.doneQty} units.` });
            }

            const qty = move.doneQty;

            if (picking.type === 'receipt' || picking.type === 'internal') {
                // +qty at destination
                const [destQuant] = await StockQuant.findOrCreate({
                    where: { productId: move.productId, locationId: picking.destLocationId },
                    defaults: { quantity: 0 },
                    transaction: t,
                });
                await destQuant.update({ quantity: destQuant.quantity + qty }, { transaction: t });
            }

            if (picking.type === 'delivery' || picking.type === 'internal') {
                // -qty at source
                const srcQuant = await StockQuant.findOne({
                    where: { productId: move.productId, locationId: picking.srcLocationId },
                    transaction: t,
                });
                if (!srcQuant || srcQuant.quantity < qty) {
                    await t.rollback();
                    const product = await Product.findByPk(move.productId);
                    return res.status(400).json({ error: `Insufficient stock for product: ${product?.name || move.productId}` });
                }
                await srcQuant.update({ quantity: srcQuant.quantity - qty }, { transaction: t });
            }

            await move.update({ status: 'done', doneQty: qty }, { transaction: t });
        }

        await picking.update({ status: 'done', doneDate: new Date() }, { transaction: t });
        await t.commit();
        res.json({ message: 'Picking validated', picking });
    } catch (err) {
        await t.rollback();
        res.status(500).json({ error: err.message });
    }
};

// ── Cancel ────────────────────────────────────────────────────────────────────
const cancelPicking = async (req, res) => {
    try {
        const picking = await StockPicking.findByPk(req.params.id);
        if (!picking) return res.status(404).json({ error: 'Not found' });
        if (picking.status === 'done') return res.status(400).json({ error: 'Done picking cannot be cancelled' });
        await picking.update({ status: 'cancelled' });
        await StockMove.update({ status: 'cancelled' }, { where: { pickingId: picking.id, status: 'draft' } });
        res.json({ message: 'Cancelled' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    listPickings,
    createPicking,
    getPicking,
    updatePicking,
    deletePicking,
    addLine,
    updateLine,
    deleteLine,
    validatePicking,
    cancelPicking,
};
