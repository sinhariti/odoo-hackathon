const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getLocations, createLocation, updateLocation, deleteLocation } = require('../controllers/locationController');

router.get('/', protect, getLocations);
router.post('/', protect, createLocation);
router.put('/:id', protect, updateLocation);
router.delete('/:id', protect, deleteLocation);

module.exports = router;
