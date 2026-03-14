const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getWarehouses,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
    getWarehouseLocations,
} = require('../controllers/warehouseController');

router.get('/', protect, getWarehouses);
router.post('/', protect, createWarehouse);
router.put('/:id', protect, updateWarehouse);
router.delete('/:id', protect, deleteWarehouse);
router.get('/:id/locations', protect, getWarehouseLocations);

module.exports = router;
