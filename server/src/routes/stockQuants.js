const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getStockQuants, getStockSummary } = require('../controllers/stockQuantController');

// NOTE: /summary before /:id pattern (no /:id here, but good practice)
router.get('/summary', protect, getStockSummary);
router.get('/', protect, getStockQuants);

module.exports = router;
