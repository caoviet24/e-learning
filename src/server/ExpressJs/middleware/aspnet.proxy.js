import { createProxyMiddleware } from 'http-proxy-middleware';

// ASP.NET Backend URL
const ASPNET_API_URL = process.env.ASPNET_API_URL || 'http://localhost:5000';

// Routes that should be proxied to ASP.NET backend
const routesToProxy = [
  '/api/courses',
  '/api/faculties',
  '/api/majors',
  '/api/lecturers',
  '/api/classes',
  '/api/users',
  '/api/auth'
];

// Create proxy middleware for ASP.NET backend
export const aspNetProxy = createProxyMiddleware({
  target: ASPNET_API_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '' // Remove /api prefix when forwarding to ASP.NET
  },
  // Add logging for debugging
  logLevel: process.env.NODE_ENV === 'production' ? 'silent' : 'debug',
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying request to ASP.NET backend: ${req.method} ${req.url}`);
  }
});

// Middleware to determine if a request should be proxied
export const shouldProxyToAspNet = (req, res, next) => {
  const path = req.path;
  
  // Check if the request path should be proxied
  const shouldProxy = routesToProxy.some(route => path.startsWith(route));
  
  if (shouldProxy) {
    // Forward to ASP.NET backend
    return aspNetProxy(req, res, next);
  }
  
  // Continue with Express.js handling
  return next();
};

export default shouldProxyToAspNet;