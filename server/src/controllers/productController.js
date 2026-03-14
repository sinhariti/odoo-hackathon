const { Op } = require('sequelize');
const { Product, Category, StockQuant, Location, ReorderingRule } = require('../models');

// GET /products
const getProducts = async (req, res) => {
    try {
        const { category, search } = req.query;
        const where = {};
        if (category) where.categoryId = category;
        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { sku: { [Op.like]: `%${search}%` } },
            ];
        }
        const products = await Product.findAll({
            where,
            include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
            order: [['createdAt', 'DESC']],
        });
        res.json({ products });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /products
const createProduct = async (req, res) => {
    try {
        const { name, sku, categoryId, uom, description } = req.body;
        if (!name || !sku) return res.status(400).json({ error: 'name and sku are required' });

        const product = await Product.create({ name, sku, categoryId, uom, description });
        res.status(201).json({ product });
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError')
            return res.status(409).json({ error: 'SKU already exists' });
        res.status(500).json({ error: err.message });
    }
};

// GET /products/:id
const getProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [
                { model: Category, as: 'category' },
                {
                    model: StockQuant,
                    as: 'quants',
                    include: [{ model: Location, as: 'location', attributes: ['id', 'name', 'type'] }],
                },
            ],
        });
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json({ product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PUT /products/:id
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        const { name, sku, categoryId, uom, description } = req.body;
        await product.update({ name, sku, categoryId, uom, description });
        res.json({ product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE /products/:id
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        const { StockMove } = require('../models');
        const moveCount = await StockMove.count({ where: { productId: product.id } });
        if (moveCount > 0)
            return res.status(400).json({ error: 'Cannot delete product with stock movements' });

        await product.destroy();
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /products/:id/stock
const getProductStock = async (req, res) => {
    try {
        const quants = await StockQuant.findAll({
            where: { productId: req.params.id },
            include: [{ model: Location, as: 'location', attributes: ['id', 'name', 'type'] }],
        });
        res.json({ stock: quants });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /products/low-stock
const getLowStockProducts = async (req, res) => {
    try {
        const rules = await ReorderingRule.findAll({
            include: [
                { model: Product, as: 'product' },
                { model: Location, as: 'location' },
            ],
        });

        const lowStock = [];
        for (const rule of rules) {
            const whereQuant = { productId: rule.productId };
            if (rule.locationId) whereQuant.locationId = rule.locationId;

            const quants = await StockQuant.findAll({ where: whereQuant });
            const totalQty = quants.reduce((sum, q) => sum + q.quantity, 0);

            if (totalQty < rule.minQty) {
                lowStock.push({
                    product: rule.product,
                    location: rule.location,
                    currentQty: totalQty,
                    minQty: rule.minQty,
                    shortage: rule.minQty - totalQty,
                });
            }
        }
        res.json({ lowStock });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getProducts,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    getProductStock,
    getLowStockProducts,
};
