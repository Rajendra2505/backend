const Product = require('../models/Product');
const Cart = require('../models/Cart');


// 🔹 ADD TO CART

const addToCart = async (req, res) => {
  try {
    const { productId, product, quantity = 1 } = req.body;

    const userId = "guest";

    if (!productId || !product) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        products: [
          {
            productId,
            product: {
              name: product.name || product.title,
              price: Number(product.price),
              image: product.image,
              category: product.category,
            },
            quantity,
          },
        ],
        totalItems: quantity,
      });
    } else {
      // ✅ FIX HERE
      const index = cart.products.findIndex(
        (p) => p.productId.toString() === productId
      );

      if (index > -1) {
        cart.products[index].quantity += quantity;
      } else {
        cart.products.push({
          productId,
          product: {
            name: product.name || product.title,
            price: Number(product.price),
            image: product.image,
            category: product.category,
          },
          quantity,
        });
      }

      // ✅ FIX TOTAL ITEMS
      cart.totalItems = cart.products.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
    }

    const savedCart = await cart.save();

    res.json({
      message: "Added to cart",
      cart: savedCart,
    });
  } catch (error) {
    console.error("Cart error:", error);
    res.status(500).json({ error: error.message });
  }
};




// 🔹 GET CART
const getCart = async (req, res) => {
  try {
    const userId = "guest";

    const cart = await Cart.findOne({ userId });

    res.json(cart?.products || []);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


// 🔹 REMOVE ITEM
const updateQuantity = async (req, res) => {
  try {
    const userId = "guest";
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const itemIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId
    );

    if (itemIndex === -1) return res.status(404).json({ error: 'Item not found' });

    cart.products[itemIndex].quantity = quantity;
    cart.totalItems = cart.products.reduce((sum, p) => sum + p.quantity, 0);

    const savedCart = await cart.save();

    res.json({ message: 'Quantity updated', cart: savedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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