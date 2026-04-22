const Product = require('../models/Product');
const Cart = require('../models/Cart');

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