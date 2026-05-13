const Order = require('../models/Order');
const Cart = require('../models/Cart');
const razorpay = require("../config/razorpay");

const generateInvoice = require("../utils/generateInvoice");
const sendEmail = require("../utils/sendEmail");
const path = require("path");

const placeOrder = async (req, res) => {
  try {
    const { userId, products, totalPrice, shippingAddress, paymentMethod, email } = req.body;

    if (!userId || !products || !shippingAddress || !email) {
      return res.status(400).json({ error: "userId, products, shippingAddress, email required" });
    }

    if (products.length === 0) {
      return res.status(400).json({ error: "No products in order" });
    }

    const order = new Order({
      userId,
      email,
      products,
      totalPrice,
      status: "pending",
      shippingAddress,
      paymentMethod: paymentMethod || "COD"
    });

    const savedOrder = await order.save();

    if (userId !== "guest") {
      await Cart.findOneAndDelete({ userId });
    }

    res.status(201).json({
      message: "Order placed successfully",
      orderId: savedOrder._id
    });

    (async () => {
      try {
        const filePath = path.join(__dirname, `../invoices/${savedOrder._id}.pdf`);
        await generateInvoice(savedOrder, filePath);
        await sendEmail(email, filePath);
      } catch (err) {
        console.error("Invoice/Email error:", err);
      }
    })();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {

  try {

    const { id } = req.params;

    const { status } = req.body;

    const order = await Order.findById(id);

    if (!order) {

      return res.status(404).json({
        error: "Order not found"
      });
    }

    order.status = status;

    await order.save();

    try {

      await sendEmail(
        order.email,
        `Order status updated to ${status}`
      );

    } catch (err) {

      console.log("Status email error:", err);
    }

    res.json(order);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndDelete(id);
    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createPayment = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now()
    };

    const order = await razorpay.orders.create(options);
    res.json(order);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
  updateOrderStatus,
  deleteOrder,
  createPayment
};