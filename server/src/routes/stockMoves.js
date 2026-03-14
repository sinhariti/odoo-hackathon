const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getStockMoves, getStockMove } = require('../controllers/stockMoveController');

router.get('/', protect, getStockMoves);
router.get('/:id', protect, getStockMove);

module.exports = router;
