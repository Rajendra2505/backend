const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: String,
  product: {
    name: String,
    price: Number,
    image: String,
    category: String
  },
  quantity: Number
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  products: [orderItemSchema],
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'dispatched', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    fullName: String,
    phone: String,
    streetAddress: String,
    city: String,
    state: String,
    pincode: String
  },
  paymentMethod: {
    type: String,
    default: 'COD'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
