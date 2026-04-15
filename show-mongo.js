const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');

mongoose.connect('mongodb://127.0.0.1:27017/amazon')
  .then(async () => {
    console.log(' Connected to MongoDB (amazon db)');
    
    
    const users = await User.find({}, '-password');
    console.log('\\n=== USERS ===');
    if (users.length === 0) {
      console.log('No users');
    } else {
      users.forEach((user, i) => {
        console.log(`${i+1}. ${user.name} (${user.email})`);
      });
    }

    
    const products = await Product.find().sort({createdAt: -1}).limit(20);
    console.log('\\n=== PRODUCTS ===');
    if (products.length === 0) {
      console.log(' No products yet. Add from http://localhost:5175/add-product !');
    } else {
      products.forEach((p, i) => {
        console.log(`${i+1}. ID:${p.id || 'N/A'} "${p.title}" [${p.category}] ₹${p.price}${p.original ? ` (orig:${p.original})` : ''}`);
      });
    }
    console.log(`\\n Total products: ${products.length}`);
    
    
    setTimeout(() => {
      mongoose.disconnect();
    }, 3000);
  })
  .catch(err => {
    console.error(' MongoDB Error:', err.message);
    process.exit(1);
  });

