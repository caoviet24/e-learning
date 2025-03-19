import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import prisma from './middleware/prisma.intercepter.js';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import AppRoute from './routes/index.js';

dotenv.config();


// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Create a write stream for access logs
const accessLogStream = fs.createWriteStream(
    path.join(logsDir, 'access.log'),
    { flags: 'a' }
);

// Initialize Express app
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'your_production_domain',
        methods: ['GET', 'POST'],
    },
});

// Enhanced logger configuration
morgan.token('timestamp', () => {
    return new Date().toISOString();
});

morgan.token('body', (req) => {
    return process.env.NODE_ENV === 'development' ? JSON.stringify(req.body) : '';
});

const colorizeMethod = (method) => {
    switch (method) {
        case 'GET':
            return '\x1b[32m' + method + '\x1b[0m';     // Green
        case 'POST':
            return '\x1b[34m' + method + '\x1b[0m';     // Blue
        case 'PUT':
            return '\x1b[33m' + method + '\x1b[0m';     // Yellow
        case 'DELETE':
            return '\x1b[31m' + method + '\x1b[0m';     // Red
        default:
            return method;
    }
};

morgan.token('colorMethod', (req) => {
    return colorizeMethod(req.method);
});

const colorizeStatus = (status) => {
    if (status >= 500) return '\x1b[31m' + status + '\x1b[0m';     // Red
    if (status >= 400) return '\x1b[33m' + status + '\x1b[0m';     // Yellow
    if (status >= 300) return '\x1b[36m' + status + '\x1b[0m';     // Cyan
    if (status >= 200) return '\x1b[32m' + status + '\x1b[0m';     // Green
    return status;
};

morgan.token('colorStatus', (req, res) => {
    return colorizeStatus(res.statusCode);
});

// Console format with colors
const consoleFormat = ':timestamp [:colorMethod] :url :colorStatus :res[content-length] - :response-time ms :body - IP: :remote-addr - :user-agent';

// File format without colors (remove color codes)
const fileFormat = ':timestamp [:method] :url :status :res[content-length] - :response-time ms :body - IP: :remote-addr - :user-agent';

// Logger middleware - Console output
app.use(morgan(consoleFormat, {
    skip: (req) => req.url === '/favicon.ico'
}));

// Logger middleware - File output
app.use(morgan(fileFormat, {
    stream: accessLogStream,
    skip: (req) => req.url === '/favicon.ico'
}));

// Essential middleware first
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW * 60 * 1000, // Default: 15 minutes
    max: process.env.RATE_LIMIT_MAX_REQUEST, // Default: 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Initialize routes after all middleware
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to E-Learning API' });
});

// Setup application routes
AppRoute(app);

// Socket.IO events
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    // Example: Join a course room
    socket.on('join-course', (courseId) => {
        socket.join(`course-${courseId}`);
    });

    // Example: Send message in course room
    socket.on('course-message', ({ courseId, message }) => {
        io.to(`course-${courseId}`).emit('new-message', message);
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);

    // Handle Prisma-specific errors
    if (err.code) {
        switch (err.code) {
            case 'P2002': // Unique constraint failed
                return res.status(409).json({
                    message: 'Dữ liệu đã tồn tại trong hệ thống',
                    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
                });
            case 'P2025': // Record not found
                return res.status(404).json({
                    message: 'Không tìm thấy dữ liệu',
                    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
                });
            default:
                return res.status(500).json({
                    message: 'Đã có lỗi xảy ra',
                    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
                });
        }
    }

    // Default error response
    res.status(500).json({
        message: 'Đã có lỗi xảy ra',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});

// Start server
const PORT = process.env.PORT || 8000;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', async (err) => {
    console.log('UNHANDLED REJECTION! Shutting down...');
    console.error(err);

    // Close Prisma connection
    await prisma.$disconnect();

    process.exit(1);
});

// Handle SIGTERM
process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Shutting down gracefully...');

    // Close Prisma connection
    await prisma.$disconnect();

    process.exit(0);
});
