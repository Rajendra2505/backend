const mongoose = require('mongoose');
const Cart = require('./models/Cart');

mongoose.connect('mongodb+srv://rajendraprasad1705_db_user:Rajendra123@amazon.67abvnn.mongodb.net/amazon')
  .then(async () => {
console.log('Connected to MongoDB (amazon db)');
    
    const carts = await Cart.find().sort({createdAt: -1}).limit(20);
    console.log('\n=== CART ITEMS ===');
    if (carts.length === 0) {
      console.log('No cart items');
    } else {
      carts.forEach((cart, i) => {
        console.log(`${i+1}. userId: ${cart.userId}, productId: ${cart.productId}`);
        console.log(`   Product: ${cart.product ? cart.product.title || 'N/A' : 'N/A'} (qty: ${cart.quantity})`);
        console.log(`   _id: ${cart._id}, created: ${cart.createdAt.toISOString().split('T')[0]}`);
        console.log('');
      });
    }
    console.log(`Total cart items: ${carts.length}`);
    
    setTimeout(() => mongoose.disconnect(), 3000);
  })
  .catch(err => {
    console.error('MongoDB Error:', err.message);
    process.exit(1);
  });

