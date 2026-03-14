const { StockMove, StockPicking, Product, Location } = require('../models');
const { Op } = require('sequelize');

// GET /stock-moves
const getStockMoves = async (req, res) => {
    try {
        const { productId, locationId, type, startDate, endDate } = req.query;
        const where = {};
        if (productId) where.productId = productId;
        if (locationId) {
            where[Op.or] = [
                { srcLocationId: locationId },
                { destLocationId: locationId },
            ];
        }

        const pickingWhere = {};
        if (type) pickingWhere.type = type;
        if (startDate || endDate) {
            pickingWhere.doneDate = {};
            if (startDate) pickingWhere.doneDate[Op.gte] = new Date(startDate);
            if (endDate) pickingWhere.doneDate[Op.lte] = new Date(endDate);
        }

        const moves = await StockMove.findAll({
            where,
            include: [
                {
                    model: StockPicking,
                    as: 'picking',
                    where: Object.keys(pickingWhere).length ? pickingWhere : undefined,
                    attributes: ['id', 'type', 'status', 'reference', 'supplierName', 'customerName', 'scheduledDate', 'doneDate'],
                },
                { model: Product, as: 'product', attributes: ['id', 'name', 'sku', 'uom'] },
                { model: Location, as: 'srcLocation', attributes: ['id', 'name'] },
                { model: Location, as: 'destLocation', attributes: ['id', 'name'] },
            ],
            order: [['createdAt', 'DESC']],
        });
        res.json({ moves });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /stock-moves/:id
const getStockMove = async (req, res) => {
    try {
        const move = await StockMove.findByPk(req.params.id, {
            include: [
                { model: StockPicking, as: 'picking' },
                { model: Product, as: 'product' },
                { model: Location, as: 'srcLocation' },
                { model: Location, as: 'destLocation' },
            ],
        });
        if (!move) return res.status(404).json({ error: 'Stock move not found' });
        res.json({ move });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getStockMoves, getStockMove };
