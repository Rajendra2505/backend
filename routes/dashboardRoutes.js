const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const Order = require("../models/Order");

router.get("/stats", async (req, res) => {
  try {
    const products = await Product.countDocuments();
    const orders = await Order.find();

    const revenue = orders.reduce(
      (sum, order) => sum + Number(order.totalPrice || 0),
      0
    );

    res.json({
      totalProducts: products,
      totalOrders: orders.length,
      totalRevenue: revenue,
      orders
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;