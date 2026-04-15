const Order = require('../models/Order');
const Cart = require('../models/Cart');
const transporter = require("../config/email");
const razorpay = require("../config/razorpay"); 


const placeOrder = async (req, res) => {
  try {
    const { userId, products, totalPrice, shippingAddress, paymentMethod, email } = req.body;

    if (!userId || !products || !shippingAddress || !email) {
      return res.status(400).json({ error: 'userId, products, shippingAddress, email required' });
    }

    if (products.length === 0) {
      return res.status(400).json({ error: 'No products in order' });
    }

    const order = new Order({
      userId,
      email,
      products,
      totalPrice,
      status: 'pending',
      shippingAddress,
      paymentMethod: paymentMethod || 'COD'
    });

    const savedOrder = await order.save();

    
    const productsHtml = products.map(item => `
      <tr>
        <td>${item.product.name}</td>
        <td>₹${item.product.price}</td>
        <td>${item.quantity}</td>
        <td>₹${item.product.price * item.quantity}</td>
      </tr>
    `).join('');

    await transporter.sendMail({
      from: "your-email@gmail.com",
      to: email,
      subject: "Order Confirmation",
      html: `
        <h2>Order Placed Successfully </h2>
        <p>Hello ${shippingAddress.fullName}</p>
        <p><b>Order ID:</b> ${savedOrder._id}</p>
        <p><b>Status:</b> Pending</p>
        <p><b>Total:</b> ₹${totalPrice}</p>

        <h3>Products:</h3>
        <table border="1" cellpadding="5">
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
          </tr>
          ${productsHtml}
        </table>

        <h3>Address:</h3>
        <p>${shippingAddress.streetAddress}, ${shippingAddress.city}</p>
      `
    });

    
    if (userId !== "guest") {
      await Cart.findOneAndDelete({ userId });
    }

    res.status(201).json({
      message: "Order placed successfully",
      orderId: savedOrder._id
    });

  } catch (error) {
    console.error(error);
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
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = status;
    await order.save();

    await transporter.sendMail({
      from: "your-email@gmail.com",
      to: order.email,
      subject: "Order Status Update",
      html: `
        <h2>Status Updated</h2>
        <p>Hello ${order.shippingAddress.fullName}</p>
        <p><b>Order ID:</b> ${order._id}</p>
        <p><b>Status:</b> ${status}</p>
      `
    });

    res.json(order);

  } catch (error) {
    res.status(500).json({ error: error.message });
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