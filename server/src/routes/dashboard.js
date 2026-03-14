const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getKpis,
    getRecentMoves,
    getStockAlerts,
    getOperationsSummary,
} = require('../controllers/dashboardController');

router.get('/kpis', protect, getKpis);
router.get('/recent-moves', protect, getRecentMoves);
router.get('/stock-alerts', protect, getStockAlerts);
router.get('/operations-summary', protect, getOperationsSummary);

module.exports = router;
