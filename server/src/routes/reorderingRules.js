const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getRules, createRule, updateRule, deleteRule, runReorder } = require('../controllers/reorderingRuleController');

// NOTE: /run before /:id
router.post('/run', protect, runReorder);

router.get('/', protect, getRules);
router.post('/', protect, createRule);
router.put('/:id', protect, updateRule);
router.delete('/:id', protect, deleteRule);

module.exports = router;
