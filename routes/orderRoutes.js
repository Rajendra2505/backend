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

router.post('/', placeOrder);

router.post('/payment', createPayment);

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      error: "failed to fetch orders"
    });
  }
});

router.get('/:userId', getUserOrders);

router.patch('/:id', updateOrderStatus);

router.delete('/:id', deleteOrder);

module.exports = router;