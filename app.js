const express = require('express');
const cors = require('cors');
const path = require('path');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Serve Next.js static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/gift-card/.next/static')));
  app.use('/_next', express.static(path.join(__dirname, '../frontend/gift-card/.next')));
}

app.use('/api/auth',          require('./routes/auth'));
app.use('/api/users',         require('./routes/users'));
app.use('/api/categories',    require('./routes/categories'));
app.use('/api/products',      require('./routes/products'));
app.use('/api/cards',         require('./routes/cards'));
app.use('/api/orders',        require('./routes/orders'));
app.use('/api/wallets',       require('./routes/wallets'));
app.use('/api/payments',      require('./routes/payments'));
app.use('/api/invoices',      require('./routes/invoices'));
app.use('/api/coupons',       require('./routes/coupons'));
app.use('/api/settings',      require('./routes/settings'));
app.use('/api/notifications', require('./routes/notifications'));

// Serve Next.js pages in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    // Don't serve frontend for API routes
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'API route not found' });
    }
    
    // For now, redirect to frontend URL or serve a basic message
    res.json({ 
      message: 'Gift Card API is running',
      frontend: 'Please access the frontend separately',
      api: 'API available at /api/*'
    });
  });
}

app.use(errorHandler);

module.exports = app;
