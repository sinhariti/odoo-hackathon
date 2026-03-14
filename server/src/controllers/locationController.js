const { Location, Warehouse } = require('../models');

// GET /locations
const getLocations = async (req, res) => {
    try {
        const { warehouseId, type } = req.query;
        const where = {};
        if (warehouseId) where.warehouseId = warehouseId;
        if (type) where.type = type;

        const locations = await Location.findAll({
            where,
            include: [{ model: Warehouse, as: 'warehouse', attributes: ['id', 'name'] }],
            order: [['name', 'ASC']],
        });
        res.json({ locations });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /locations
const createLocation = async (req, res) => {
    try {
        const { warehouseId, name, type } = req.body;
        if (!warehouseId || !name) return res.status(400).json({ error: 'warehouseId and name are required' });
        const location = await Location.create({ warehouseId, name, type });
        res.status(201).json({ location });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PUT /locations/:id
const updateLocation = async (req, res) => {
    try {
        const location = await Location.findByPk(req.params.id);
        if (!location) return res.status(404).json({ error: 'Location not found' });
        await location.update(req.body);
        res.json({ location });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE /locations/:id
const deleteLocation = async (req, res) => {
    try {
        const location = await Location.findByPk(req.params.id);
        if (!location) return res.status(404).json({ error: 'Location not found' });
        await location.destroy();
        res.json({ message: 'Location deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getLocations, createLocation, updateLocation, deleteLocation };
