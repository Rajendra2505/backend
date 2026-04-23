const express = require('express');
const router = express.Router();

const { 
  placeOrder, 
  getUserOrders, 
  updateOrderStatus, 
  deleteOrder, 
  createPayment   
} = require('../controllers/orderController');

const Order = require('../models/Order');

// ✅ FIXED
router.post('/', placeOrder);

// GET ALL ORDERS
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "failed to fetch orders" });
  }
});

// GET USER ORDERS
router.get('/:userId', getUserOrders);

// UPDATE STATUS
router.patch('/:id', updateOrderStatus);

// DELETE ORDER
router.delete('/:id', deleteOrder);

// PAYMENT
router.post('/payment', createPayment);

module.exports = router;