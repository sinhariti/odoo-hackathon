const { StockQuant, Product, Location, Warehouse, sequelize } = require('../models');
const { Op } = require('sequelize');

// GET /stock-quants
const getStockQuants = async (req, res) => {
    try {
        const { productId, locationId, warehouseId } = req.query;
        const where = {};
        if (productId) where.productId = productId;
        if (locationId) where.locationId = locationId;

        const locationWhere = {};
        if (warehouseId) locationWhere.warehouseId = warehouseId;

        const quants = await StockQuant.findAll({
            where,
            include: [
                { model: Product, as: 'product', attributes: ['id', 'name', 'sku', 'uom'] },
                { model: Location, as: 'location', where: Object.keys(locationWhere).length ? locationWhere : undefined, attributes: ['id', 'name', 'type', 'warehouseId'] },
            ],
        });
        res.json({ quants });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /stock-quants/summary
const getStockSummary = async (req, res) => {
    try {
        const summary = await StockQuant.findAll({
            attributes: [
                'productId',
                [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQty'],
            ],
            include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'sku', 'uom'] }],
            group: ['productId', 'product.id'],
        });
        res.json({ summary });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getStockQuants, getStockSummary };
