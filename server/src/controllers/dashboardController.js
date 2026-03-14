const { Product, StockPicking, StockMove, StockQuant, ReorderingRule, Location, sequelize } = require('../models');
const { Op } = require('sequelize');

// GET /dashboard/kpis
const getKpis = async (req, res) => {
    try {
        const totalProducts = await Product.count();

        // Low stock: products where quant qty < their reordering rule minQty
        const rules = await ReorderingRule.findAll();
        let lowStockCount = 0;
        for (const rule of rules) {
            const whereQuant = { productId: rule.productId };
            if (rule.locationId) whereQuant.locationId = rule.locationId;
            const quants = await StockQuant.findAll({ where: whereQuant });
            const totalQty = quants.reduce((sum, q) => sum + q.quantity, 0);
            if (totalQty < rule.minQty) lowStockCount++;
        }

        const pendingReceipts = await StockPicking.count({
            where: { type: 'receipt', status: { [Op.in]: ['draft', 'waiting', 'ready'] } },
        });

        const pendingDeliveries = await StockPicking.count({
            where: { type: 'delivery', status: { [Op.in]: ['draft', 'waiting', 'ready'] } },
        });

        const transfersScheduled = await StockPicking.count({
            where: { type: 'internal', status: { [Op.in]: ['draft', 'waiting', 'ready'] } },
        });

        res.json({
            kpis: {
                totalProducts,
                lowStockCount,
                pendingReceipts,
                pendingDeliveries,
                transfersScheduled,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /dashboard/recent-moves
const getRecentMoves = async (req, res) => {
    try {
        const { Product, Location } = require('../models');
        const moves = await StockMove.findAll({
            include: [
                {
                    model: StockPicking,
                    as: 'picking',
                    attributes: ['id', 'type', 'status', 'supplierName', 'customerName'],
                },
                { model: Product, as: 'product', attributes: ['id', 'name', 'sku'] },
                { model: Location, as: 'srcLocation', attributes: ['id', 'name'] },
                { model: Location, as: 'destLocation', attributes: ['id', 'name'] },
            ],
            order: [['updatedAt', 'DESC']],
            limit: 10,
        });
        res.json({ moves });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /dashboard/stock-alerts
const getStockAlerts = async (req, res) => {
    try {
        const { Product, Location } = require('../models');
        const rules = await ReorderingRule.findAll({
            include: [
                { model: Product, as: 'product', attributes: ['id', 'name', 'sku', 'uom'] },
                { model: Location, as: 'location', attributes: ['id', 'name'] },
            ],
        });

        const alerts = [];
        for (const rule of rules) {
            const whereQuant = { productId: rule.productId };
            if (rule.locationId) whereQuant.locationId = rule.locationId;
            const quants = await StockQuant.findAll({ where: whereQuant });
            const currentQty = quants.reduce((sum, q) => sum + q.quantity, 0);

            if (currentQty < rule.minQty) {
                alerts.push({
                    product: rule.product,
                    location: rule.location,
                    currentQty,
                    minQty: rule.minQty,
                    shortage: rule.minQty - currentQty,
                });
            }
        }
        res.json({ alerts });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /dashboard/operations-summary
const getOperationsSummary = async (req, res) => {
    try {
        const summary = await StockPicking.findAll({
            attributes: [
                'type',
                'status',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
            ],
            group: ['type', 'status'],
            raw: true,
        });

        // Re-shape into { receipt: { draft: N, done: N, ... }, delivery: {...}, internal: {...} }
        const shaped = {};
        for (const row of summary) {
            if (!shaped[row.type]) shaped[row.type] = {};
            shaped[row.type][row.status] = parseInt(row.count, 10);
        }

        res.json({ summary: shaped });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getKpis, getRecentMoves, getStockAlerts, getOperationsSummary };
