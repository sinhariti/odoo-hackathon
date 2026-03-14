const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    listPickings,
    createPicking,
    getPicking,
    updatePicking,
    deletePicking,
    addLine,
    updateLine,
    deleteLine,
    validatePicking,
    cancelPicking,
} = require('../controllers/pickingController');

const TYPE = 'delivery';

router.get('/', protect, listPickings(TYPE));
router.post('/', protect, createPicking(TYPE));
router.get('/:id', protect, getPicking);
router.put('/:id', protect, updatePicking);
router.delete('/:id', protect, deletePicking);
router.post('/:id/lines', protect, addLine);
router.put('/:id/lines/:lineId', protect, updateLine);
router.delete('/:id/lines/:lineId', protect, deleteLine);
router.post('/:id/validate', protect, validatePicking);
router.post('/:id/cancel', protect, cancelPicking);

module.exports = router;
