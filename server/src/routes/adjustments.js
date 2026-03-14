const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getAdjustments,
    createAdjustment,
    getAdjustment,
    updateAdjustment,
    validateAdjustment,
    cancelAdjustment,
} = require('../controllers/adjustmentController');

router.get('/', protect, getAdjustments);
router.post('/', protect, createAdjustment);
router.get('/:id', protect, getAdjustment);
router.put('/:id', protect, updateAdjustment);
router.post('/:id/validate', protect, validateAdjustment);
router.post('/:id/cancel', protect, cancelAdjustment);

module.exports = router;
