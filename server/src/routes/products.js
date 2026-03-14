const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getProducts,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    getProductStock,
    getLowStockProducts,
} = require('../controllers/productController');

// NOTE: /low-stock must be declared BEFORE /:id so it isn't treated as an id
router.get('/low-stock', protect, getLowStockProducts);

router.get('/', protect, getProducts);
router.post('/', protect, createProduct);
router.get('/:id', protect, getProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);
router.get('/:id/stock', protect, getProductStock);

module.exports = router;
