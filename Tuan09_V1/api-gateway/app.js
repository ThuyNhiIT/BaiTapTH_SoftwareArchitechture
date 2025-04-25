const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Kích hoạt CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Middleware parse JSON
app.use(express.json());

// Log tất cả yêu cầu
app.use((req, res, next) => {
    console.log(`[API Gateway] Yêu cầu đến: ${req.method} ${req.originalUrl}`);
    console.log(`[API Gateway] Body:`, req.body);
    next();
});

// Proxy đến Order Service
app.use(
    '/orders',
    (req, res, next) => {
        console.log(`[API Gateway] Chuyển tiếp đến Order Service: ${req.method} ${req.originalUrl}`);
        next();
    },
    createProxyMiddleware({
        target: 'http://localhost:3005/api/orders', // Chỉ định gốc của Order Service
        changeOrigin: true,
        proxyTimeout: 10000,
        timeout: 10000,
        pathRewrite: {
            '^/orders': '/api/orders' // Chuyển /orders thành /api/orders
        },
        onError: (err, req, res) => {
            console.error(`[API Gateway] Lỗi khi chuyển tiếp đến Order Service: ${err.message}`);
            res.status(500).json({ message: 'Lỗi kết nối đến Dịch vụ Đơn hàng', error: err.message });
        },
        onProxyReq: (proxyReq, req, res) => {
            console.log('[HPM] Proxy request sent to:', proxyReq.path);
        },
        onProxyRes: (proxyRes, req, res) => {
            console.log('[HPM] Proxy response received:', proxyRes.statusCode);
        }
    })
);

// Proxy đến Product-Inventory Service
// Proxy đến Product-Inventory Service
app.use(
    '/products',
    (req, res, next) => {
        console.log(`[API Gateway] Chuyển tiếp đến Product-Inventory Service: ${req.method} ${req.originalUrl}`);
        console.log(`[API Gateway] Body gửi đi:`, req.body);
        console.log(`[API Gateway] Headers gửi đi:`, req.headers);
        next();
    },
    createProxyMiddleware({
        target: 'http://localhost:3004/api/products', // Chỉ định gốc của Product-Inventory Service
        changeOrigin: true,
        timeout: 15000,
        proxyTimeout: 15000,
        pathRewrite: (path, req) => {
            // console.log("Original Path:", path); // Để debug

            if (path === '/products/create') {
                return '/api/products/create'; // POST /products/create -> /api/products/create
            } else if (path.startsWith('/products/inventory/update')) {
                return '/api/products/inventory/update'; // POST /products/inventory/update -> /api/products/inventory/update
            } else if (path.startsWith('/products/inventory/status/')) {
                return path.replace('/products', '/api/products');  // GET /products/inventory/status/:productId -> /api/products/inventory/status/:productId
            }
            else if (path.startsWith('/products/')) {
                 return path.replace('/products', '/api/products');
            }
        },
        onProxyReq: (proxyReq, req, res) => {
            // Đảm bảo Content-Length đúng
            if (req.body) {
                const bodyData = JSON.stringify(req.body);
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            }
        },
        onProxyRes: (proxyRes, req, res) => {
            console.log(`[API Gateway] Phản hồi từ Product-Inventory Service: ${proxyRes.statusCode}`);
        },
        onError: (err, req, res) => {
            console.log(`[API Gateway] Lỗi khi chuyển tiếp đến Product-Inventory Service: ${err.message}`);
            res.status(500).json({ message: 'Lỗi kết nối đến Dịch vụ Sản phẩm và Tồn kho', error: err.message });
        }
    })
);

// Proxy đến Payment Service
app.use(
    '/payments',
    (req, res, next) => {
        console.log(`[API Gateway] Chuyển tiếp đến Payment Service: ${req.method} ${req.originalUrl}`);
        next();
    },
    createProxyMiddleware({
        target: 'http://localhost:3006/api/payments', // Chỉ định gốc của Payment Service
        changeOrigin: true,
        proxyTimeout: 10000,
        timeout: 10000,
        pathRewrite: {
            '^/payments': '/api/payments' // Chuyển /payments thành /api/payments
        },
        onError: (err, req, res) => {
            console.error(`[API Gateway] Lỗi khi chuyển tiếp đến Payment Service: ${err.message}`);
            res.status(500).json({ message: 'Lỗi kết nối đến Dịch vụ Thanh toán', error: err.message });
        },
        onProxyReq: (proxyReq, req, res) => {
            console.log('[HPM] Proxy request sent to:', proxyReq.path);
        },
        onProxyRes: (proxyRes, req, res) => {
            console.log('[HPM] Proxy response received:', proxyRes.statusCode);
        }
    })
);

// Proxy đến Shipping Service
app.use(
    '/products',
    (req, res, next) => {
        console.log(`[API Gateway] Chuyển tiếp đến Product-Inventory Service: ${req.method} ${req.originalUrl}`);
        console.log(`[API Gateway] Body gửi đi:`, req.body);
        console.log(`[API Gateway] Headers gửi đi:`, req.headers);
        next();
    },
    createProxyMiddleware({
        target: 'http://localhost:3004/api/products',
        changeOrigin: true,
        timeout: 15000, // 15 giây
        proxyTimeout: 15000, // 15 giây
        pathRewrite: {
            '^/products': '/api/products'
        },
        onProxyReq: (proxyReq, req, res) => {
            // Đảm bảo Content-Length đúng
            if (req.body) {
                const bodyData = JSON.stringify(req.body);
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            }
        },
        onProxyRes: (proxyRes, req, res) => {
            console.log(`[API Gateway] Phản hồi từ Product-Inventory Service: ${proxyRes.statusCode}`);
        },
        onError: (err, req, res) => {
            console.log(`[API Gateway] Lỗi khi chuyển tiếp đến Product-Inventory Service: ${err.message}`);
            res.status(500).json({ message: 'Lỗi kết nối đến Dịch vụ Sản phẩm và Tồn kho', error: err.message });
        }
    })
);

// Route kiểm tra sức khỏe
app.get('/', (req, res) => {
    res.json({ message: 'API Gateway đang hoạt động' });
});

// Xử lý route không khớp
app.use((req, res) => {
    console.log(`[API Gateway] Không tìm thấy route: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ message: `Không thể ${req.method} ${req.originalUrl}` });
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API Gateway đang chạy tại http://localhost:${PORT}`);
});