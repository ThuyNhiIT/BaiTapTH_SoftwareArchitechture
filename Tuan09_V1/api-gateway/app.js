const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const app = express();

app.use(express.json());

// Rate Limiter configuration
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // Limit each IP to 100 requests
});
app.use(limiter);

// Service URLs
const services = {
    orders: 'http://localhost:3004',
    products: 'http://localhost:3005',
    payments: 'http://localhost:3006',
    shipping: 'http://localhost:3007'
};

// Proxy requests to Order Service
app.use('/api/invoices', async (req, res) => {
    try {
        const response = await axios({
            method: req.method,
            url: `${services.orders}${req.originalUrl}`,
            data: req.body
        });
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ message: 'Error forwarding to Order Service: ' + err.message });
    }
});

// Proxy requests to Product-Inventory Service
app.use('/api/products', async (req, res) => {
    try {
        const response = await axios({
            method: req.method,
            url: `${services.products}${req.originalUrl}`,
            data: req.body
        });
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ message: 'Error forwarding to Product-Inventory Service: ' + err.message });
    }
});

// Proxy requests to Payment Service
app.use('/api/payments', async (req, res) => {
    try {
        const response = await axios({
            method: req.method,
            url: `${services.payments}${req.originalUrl}`,
            data: req.body
        });
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ message: 'Error forwarding to Payment Service: ' + err.message });
    }
});

// Proxy requests to Shipping Service
app.use('/api/shipments', async (req, res) => {
    try {
        const response = await axios({
            method: req.method,
            url: `${services.shipping}${req.originalUrl}`,
            data: req.body
        });
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ message: 'Error forwarding to Shipping Service: ' + err.message });
    }
});

app.listen(3003, () => console.log('API Gateway running on port 3003'));