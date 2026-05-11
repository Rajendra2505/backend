const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.json({
      totalProducts: 25,
      totalOrders: 10,
      totalUsers: 5,
      totalRevenue: 50000
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;