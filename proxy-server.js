const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Crear un proxy que redirige a wrangler dev
const proxy = createProxyMiddleware({
  target: 'http://127.0.0.1:8787',
  changeOrigin: true,
  ws: true, // Habilitar WebSocket si es necesario
  onError: (err, req, res) => {
    console.error('Proxy error:', err.message);
    res.statusCode = 500;
    res.end('Proxy Error: ' + err.message);
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxy: ${req.method} ${req.url} -> http://127.0.0.1:8787${req.url}`);
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
