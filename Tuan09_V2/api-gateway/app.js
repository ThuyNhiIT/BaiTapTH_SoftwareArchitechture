const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

// Initialize Express app
const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[API Gateway] Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

// Proxy to ProductService
app.use(
  '/products',
  (req, res, next) => {
    console.log('[API Gateway] Proxying to ProductService:', req.method, req.originalUrl);
    next();
  },
  createProxyMiddleware({
    target: 'http://localhost:3004/api/products',
    changeOrigin: true,
    pathRewrite: {
      '^/products': '/api/products', // Rewrite /products to /api/products
    },
  })
);

// Proxy to OrderService
app.use(
  '/invoices',
  (req, res, next) => {
    console.log('[API Gateway] Proxying to OrderService:', req.method, req.originalUrl);
    next();
  },
  createProxyMiddleware({
    target: 'http://localhost:3005/api/invoices',
    changeOrigin: true,
    pathRewrite: {
      '^/invoices': '/api/invoices', // Rewrite /invoices to /api/invoices
    },
  })
);

// Health check route
app.get('/', (req, res) => {
  res.send('API Gateway is running...');
});

// Catch-all route for unmatched routes
app.use((req, res) => {
  console.log(`[API Gateway] Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: `Cannot ${req.method} ${req.originalUrl}` });
});

// Start the server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`);
});