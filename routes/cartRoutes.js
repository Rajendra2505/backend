const express = require('express');
const router = express.Router();

const {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
  updateQuantity   // ✅ ADD THIS
} = require('../controllers/cartController');

// ADD TO CART
router.post('/', addToCart);
router.post('/guest', addToCart);

// GET CART
router.get('/', getCart);
router.get('/guest', getCart);
router.get('/:userId', getCart);

// CLEAR CART
router.post('/clear', clearCart);

// UPDATE QUANTITY
router.patch('/:productId', updateQuantity);

// REMOVE ITEM
router.delete('/:productId', removeFromCart);

module.exports = router;