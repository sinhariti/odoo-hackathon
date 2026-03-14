const { ReorderingRule, Product, Location, StockQuant, StockPicking, StockMove, sequelize } = require('../models');

// GET /reordering-rules
const getRules = async (req, res) => {
    try {
        const rules = await ReorderingRule.findAll({
            include: [
                { model: Product, as: 'product' },
                { model: Location, as: 'location' },
            ],
        });
        res.json({ rules });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /reordering-rules
const createRule = async (req, res) => {
    try {
        const { productId, locationId, minQty, maxQty } = req.body;
        if (!productId || minQty === undefined)
            return res.status(400).json({ error: 'productId and minQty are required' });
        const rule = await ReorderingRule.create({ productId, locationId, minQty, maxQty });
        res.status(201).json({ rule });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PUT /reordering-rules/:id
const updateRule = async (req, res) => {
    try {
        const rule = await ReorderingRule.findByPk(req.params.id);
        if (!rule) return res.status(404).json({ error: 'Rule not found' });
        await rule.update(req.body);
        res.json({ rule });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE /reordering-rules/:id
const deleteRule = async (req, res) => {
    try {
        const rule = await ReorderingRule.findByPk(req.params.id);
        if (!rule) return res.status(404).json({ error: 'Rule not found' });
        await rule.destroy();
        res.json({ message: 'Rule deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /reordering-rules/run  — trigger reorder check, create draft receipts
const runReorder = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const rules = await ReorderingRule.findAll({
            include: [{ model: Product, as: 'product' }, { model: Location, as: 'location' }],
        });

        const createdPickings = [];

        for (const rule of rules) {
            const whereQuant = { productId: rule.productId };
            if (rule.locationId) whereQuant.locationId = rule.locationId;

            const quants = await StockQuant.findAll({ where: whereQuant, transaction: t });
            const totalQty = quants.reduce((sum, q) => sum + q.quantity, 0);

            if (totalQty < rule.minQty) {
                const orderQty = (rule.maxQty || rule.minQty * 2) - totalQty;

                const picking = await StockPicking.create(
                    {
                        type: 'receipt',
                        status: 'draft',
                        destLocationId: rule.locationId || null,
                        supplierName: 'Auto-Reorder',
                        createdById: req.user.id,
                        scheduledDate: new Date(),
                    },
                    { transaction: t }
                );

                await StockMove.create(
                    {
                        pickingId: picking.id,
                        productId: rule.productId,
                        destLocationId: rule.locationId || null,
                        demandQty: orderQty,
                        doneQty: 0,
                        status: 'draft',
                    },
                    { transaction: t }
                );

                createdPickings.push({ picking, rule: rule.id, orderQty });
            }
        }

        await t.commit();
        res.json({ message: `Reorder run complete. Created ${createdPickings.length} draft receipt(s).`, createdPickings });
    } catch (err) {
        await t.rollback();
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getRules, createRule, updateRule, deleteRule, runReorder };
