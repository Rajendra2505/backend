// require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const dns = require('dns');

dns.setServers(["1.1.1.1","8.8.8.8"]);



const app = express();
const PORT = 3002;


app.use(cors());
app.use(express.json()); 


connectDB();



const path = require('path');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api/products', productRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', require('./routes/orderRoutes'));


app.get('/', (req, res) => {
  res.json({ message: 'E-commerce API is running!' });
});


app.use((error, req, res, next) => {
  
  if (error.name === 'MulterError') {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Max 5MB allowed.' });
    }
    return res.status(400).json({ error: error.message });
  }

  console.error('Server error:', error);
  res.status(500).json({ error: error.message || 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});