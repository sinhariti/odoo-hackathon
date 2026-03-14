const { StockAdjustment, StockQuant, Product, Location, User, sequelize } = require('../models');

// GET /adjustments
const getAdjustments = async (req, res) => {
    try {
        const { status, productId, locationId } = req.query;
        const where = {};
        if (status) where.status = status;
        if (productId) where.productId = productId;
        if (locationId) where.locationId = locationId;

        const adjustments = await StockAdjustment.findAll({
            where,
            include: [
                { model: Product, as: 'product', attributes: ['id', 'name', 'sku', 'uom'] },
                { model: Location, as: 'location', attributes: ['id', 'name'] },
                { model: User, as: 'createdBy', attributes: ['id', 'name'] },
            ],
            order: [['createdAt', 'DESC']],
        });
        res.json({ adjustments });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /adjustments
const createAdjustment = async (req, res) => {
    try {
        const { productId, locationId, countedQty, reason } = req.body;
        if (!productId || !locationId || countedQty === undefined)
            return res.status(400).json({ error: 'productId, locationId, and countedQty are required' });

        const quant = await StockQuant.findOne({ where: { productId, locationId } });
        const systemQty = quant ? quant.quantity : 0;
        const difference = countedQty - systemQty;

        const adjustment = await StockAdjustment.create({
            productId,
            locationId,
            countedQty,
            systemQty,
            difference,
            reason,
            status: 'draft',
            createdById: req.user.id,
        });
        res.status(201).json({ adjustment });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /adjustments/:id
const getAdjustment = async (req, res) => {
    try {
        const adjustment = await StockAdjustment.findByPk(req.params.id, {
            include: [
                { model: Product, as: 'product' },
                { model: Location, as: 'location' },
                { model: User, as: 'createdBy', attributes: ['id', 'name'] },
            ],
        });
        if (!adjustment) return res.status(404).json({ error: 'Adjustment not found' });
        res.json({ adjustment });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PUT /adjustments/:id
const updateAdjustment = async (req, res) => {
    try {
        const adjustment = await StockAdjustment.findByPk(req.params.id);
        if (!adjustment) return res.status(404).json({ error: 'Adjustment not found' });
        if (adjustment.status === 'applied') return res.status(400).json({ error: 'Cannot update applied adjustment' });

        const { countedQty } = req.body;
        if (countedQty !== undefined) {
            const difference = countedQty - adjustment.systemQty;
            await adjustment.update({ countedQty, difference });
        } else {
            await adjustment.update(req.body);
        }
        res.json({ adjustment });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /adjustments/:id/validate
const validateAdjustment = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const adjustment = await StockAdjustment.findByPk(req.params.id, { transaction: t });
        if (!adjustment) { await t.rollback(); return res.status(404).json({ error: 'Adjustment not found' }); }
        if (adjustment.status === 'applied') { await t.rollback(); return res.status(400).json({ error: 'Already applied' }); }

        const [quant] = await StockQuant.findOrCreate({
            where: { productId: adjustment.productId, locationId: adjustment.locationId },
            defaults: { quantity: 0 },
            transaction: t,
        });

        await quant.update({ quantity: adjustment.countedQty }, { transaction: t });
        await adjustment.update({ status: 'applied', difference: adjustment.countedQty - quant.quantity }, { transaction: t });

        await t.commit();
        res.json({ message: 'Adjustment applied', adjustment });
    } catch (err) {
        await t.rollback();
        res.status(500).json({ error: err.message });
    }
};

// POST /adjustments/:id/cancel
const cancelAdjustment = async (req, res) => {
    try {
        const adjustment = await StockAdjustment.findByPk(req.params.id);
        if (!adjustment) return res.status(404).json({ error: 'Adjustment not found' });
        if (adjustment.status === 'applied') return res.status(400).json({ error: 'Applied adjustment cannot be cancelled' });
        await adjustment.update({ status: 'draft' }); // revert to draft = "cancelled" state
        res.json({ message: 'Adjustment cancelled' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAdjustments, createAdjustment, getAdjustment, updateAdjustment, validateAdjustment, cancelAdjustment };
