const express = require('express');
const router = express.Router();
const {
  addToCart,
  getCart,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');

router.post('/', addToCart);

router.post('/guest', addToCart);

router.get('/', getCart);        // ✅ ADD THIS
router.get('/guest', getCart);
router.get('/:userId', getCart);

router.post('/clear', clearCart);

router.delete('/:productId', removeFromCart);

module.exports = router;