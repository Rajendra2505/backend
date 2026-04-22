const Product = require('../models/Product');
const Cart = require('../models/Cart');


// 🔹 ADD TO CART
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID required' });
    }

    const userId = "guest";

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        products: [
          {
            productId,
            product: {
              name: product.name,
              price: product.price,
              image: product.image,
              category: product.category
            },
            quantity
          }
        ],
        totalItems: quantity
      });
    } else {
      const index = cart.products.findIndex(
        (p) => p.productId.toString() === productId
      );

      if (index > -1) {
        cart.products[index].quantity += quantity;
      } else {
        cart.products.push({
          productId,
          product: {
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category
          },
          quantity
        });
      }

      cart.totalItems = cart.products.reduce(
        (sum, p) => sum + p.quantity,
        0
      );
    }

    const savedCart = await cart.save();

    res.json({ message: 'Added to cart', cart: savedCart });

  } catch (error) {
    console.error('addToCart error:', error);
    res.status(500).json({ error: error.message });
  }
};


// 🔹 GET CART
const getCart = async (req, res) => {
  try {
    const userId = "guest";

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.json({ products: [] });
    }

    res.json(cart);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


// 🔹 REMOVE ITEM
const removeFromCart = async (req, res) => {
  try {
    const userId = "guest";
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.products = cart.products.filter(
      (p) => p.productId.toString() !== productId
    );

    cart.totalItems = cart.products.reduce(
      (sum, p) => sum + p.quantity,
      0
    );

    const savedCart = await cart.save();

    res.json({ message: 'Removed from cart', cart: savedCart });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 🔹 CLEAR CART
const clearCart = async (req, res) => {
  try {
    const userId = "guest";

    await Cart.findOneAndDelete({ userId });

    res.json({ message: 'Cart cleared' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  clearCart
};