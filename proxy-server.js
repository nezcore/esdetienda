const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Crear un proxy que redirige a wrangler dev
const proxy = createProxyMiddleware({
  target: 'http://127.0.0.1:8787',
  changeOrigin: true,
  ws: true,
  timeout: 10000, // 10 segundos timeout
  proxyTimeout: 10000,
  onError: (err, req, res) => {
    console.error(`❌ Proxy error for ${req.method} ${req.url}:`, err.message);
    
    // Si la respuesta aún no se envió, enviar error
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        error: 'Proxy Error',
        message: err.message,
        timestamp: new Date().toISOString()
      }));
    }
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`🔄 Proxy: ${req.method} ${req.url} -> http://127.0.0.1:8787${req.url}`);
    
    // Agregar headers para CORS
    proxyReq.setHeader('Access-Control-Allow-Origin', '*');
    proxyReq.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    proxyReq.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`✅ Response: ${proxyRes.statusCode} for ${req.method} ${req.url}`);
    
    // Agregar headers CORS a la respuesta
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization';
  }
});

// Crear servidor HTTP
const server = http.createServer(proxy);

// Escuchar en todas las interfaces
const PORT = 8788;
const HOST = '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`🚀 Proxy server running on http://${HOST === '0.0.0.0' ? '0.0.0.0' : HOST}:${PORT}`);
  console.log(`   Forwarding to: http://127.0.0.1:8787`);
  console.log(`   Access from mobile: http://10.0.0.8:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  } else {
    console.error('❌ Server error:', err.message);
  }
});
