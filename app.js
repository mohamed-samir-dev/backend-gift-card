const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

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

app.use(errorHandler);

module.exports = app;
