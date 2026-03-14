const { Category, Product } = require('../models');

// GET /categories
const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({ order: [['name', 'ASC']] });
        res.json({ categories });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /categories
const createCategory = async (req, res) => {
    try {
        const { name, description, parentId } = req.body;
        if (!name) return res.status(400).json({ error: 'name is required' });
        const category = await Category.create({ name, description, parentId });
        res.status(201).json({ category });
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError')
            return res.status(409).json({ error: 'Category name already exists' });
        res.status(500).json({ error: err.message });
    }
};

// PUT /categories/:id
const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) return res.status(404).json({ error: 'Category not found' });
        await category.update(req.body);
        res.json({ category });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE /categories/:id
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) return res.status(404).json({ error: 'Category not found' });

        const productCount = await Product.count({ where: { categoryId: category.id } });
        if (productCount > 0)
            return res.status(400).json({ error: 'Cannot delete category with assigned products' });

        await category.destroy();
        res.json({ message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
