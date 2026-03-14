const { Warehouse, Location } = require('../models');

// GET /warehouses
const getWarehouses = async (req, res) => {
    try {
        const warehouses = await Warehouse.findAll({ order: [['name', 'ASC']] });
        res.json({ warehouses });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /warehouses
const createWarehouse = async (req, res) => {
    try {
        const { name, code, address } = req.body;
        if (!name) return res.status(400).json({ error: 'name is required' });
        const warehouse = await Warehouse.create({ name, code, address });
        res.status(201).json({ warehouse });
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError')
            return res.status(409).json({ error: 'Warehouse name or code already exists' });
        res.status(500).json({ error: err.message });
    }
};

// PUT /warehouses/:id
const updateWarehouse = async (req, res) => {
    try {
        const warehouse = await Warehouse.findByPk(req.params.id);
        if (!warehouse) return res.status(404).json({ error: 'Warehouse not found' });
        await warehouse.update(req.body);
        res.json({ warehouse });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE /warehouses/:id
const deleteWarehouse = async (req, res) => {
    try {
        const warehouse = await Warehouse.findByPk(req.params.id);
        if (!warehouse) return res.status(404).json({ error: 'Warehouse not found' });
        await warehouse.destroy();
        res.json({ message: 'Warehouse deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /warehouses/:id/locations
const getWarehouseLocations = async (req, res) => {
    try {
        const warehouse = await Warehouse.findByPk(req.params.id, {
            include: [{ model: Location, as: 'locations' }],
        });
        if (!warehouse) return res.status(404).json({ error: 'Warehouse not found' });
        res.json({ locations: warehouse.locations });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getWarehouses, createWarehouse, updateWarehouse, deleteWarehouse, getWarehouseLocations };
