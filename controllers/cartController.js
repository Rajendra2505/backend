const Cart = require('../models/Cart');


const addToCart = async (req, res) => {
  try {
    const { userId, productId, product, quantity = 1 } = req.body;
    console.log('Cart ADD:', { userId, productId });

    if (!userId || !productId || !product) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = new Cart({ 
        userId, 
        products: [{
          productId,
          product: {
            name: product.name || product.title,
            price: Number(product.price),
            image: product.image,
            category: product.category
          },
          quantity
        }],
        totalItems: quantity
      });
    } else {
      
      const existingIndex = cart.products.findIndex(p => p.productId === productId);
      
      if (existingIndex > -1) {
        cart.products[existingIndex].quantity += quantity;
      } else {
        cart.products.push({
          productId,
          product: {
            name: product.name || product.title,
            price: Number(product.price),
            image: product.image,
            category: product.category
          },
          quantity
        });
      }
      cart.totalItems = cart.products.reduce((sum, p) => sum + p.quantity, 0);
    }

    const savedCart = await cart.save();
    res.json({ message: 'Added to cart', cart: savedCart });
  } catch (error) {
    console.error('addToCart error:', error);
    res.status(500).json({ error: error.message });
  }
};


const getCart = async (req, res) => {
  try {
    const { userId = 'guest' } = req.params;
    const cart = await Cart.findOne({ userId });
    res.json(cart || { products: [], totalItems: 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const removeFromCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const { productId } = req.params;
    
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    
    cart.products = cart.products.filter(p => p.productId !== productId);
    cart.totalItems = cart.products.reduce((sum, p) => sum + p.quantity, 0);
    
    const savedCart = await cart.save();
    res.json({ message: 'Removed from cart', cart: savedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const clearCart = async (req, res) => {
  try {
    const { userId } = req.body;
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
