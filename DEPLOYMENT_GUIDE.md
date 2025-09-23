# Guía de Deployment - EsDeTienda

## 📋 Checklist de Deployment

### Pre-requisitos
- [ ] Cuenta de Cloudflare con dominio `esdetienda.com`
- [ ] MongoDB Atlas cluster configurado
- [ ] OpenRouter API key
- [ ] AssemblyAI API key (opcional)
- [ ] PostHog account
- [ ] Sentry account

### 1. Setup Local
```bash
git clone <repository>
cd esdetienda
./scripts/setup.sh
# Editar .env con credenciales reales
```

### 2. Cloudflare Resources
```bash
# KV Namespace
wrangler kv:namespace create "KV"
# Copiar ID a wrangler.toml

# R2 Bucket
wrangler r2 bucket create esdetienda-media

# Hyperdrive  
wrangler hyperdrive create esdetienda-db --connection-string="<MONGODB_URI>"
# Copiar ID a wrangler.toml
```

### 3. Deploy API Worker
```bash
cd apps/worker-api
# Actualizar wrangler.toml con IDs reales
wrangler deploy
# Configurar variables de entorno en Dashboard
```

### 4. Deploy Frontend
```bash
cd apps/frontend
npm run build
# Conectar repositorio con Cloudflare Pages
# Configurar dominio esdetienda.com
# Agregar variables de entorno VITE_*
```

### 5. Configurar Dominios
- [ ] Frontend: `esdetienda.com` → Pages
- [ ] API: `api.esdetienda.com` → Worker Custom Domain

## 🧪 Smoke Tests

Después del deployment, verificar:

### API Health Check
```bash
curl https://api.esdetienda.com/health
# Debe devolver: {"ok": true, "status": "healthy"}
```

### Chat Endpoint
```bash
curl -X POST https://api.esdetienda.com/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "¿Qué productos tienen?"}
    ]
  }'
```

### Vision Endpoint
```bash
curl -X POST https://api.esdetienda.com/vision \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://via.placeholder.com/300x300",
    "userQuery": "¿Qué producto es este?"
  }'
```

### Search Endpoint  
```bash
curl "https://api.esdetienda.com/search?q=zapatos&tenant=demo"
```

### Tenant Info
```bash
curl https://api.esdetienda.com/tenants/demo
```

## 📊 Monitoring Setup

### PostHog Events
Verificar que se registren estos eventos:
- `search_performed`
- `product_viewed`
- `add_to_cart`
- `checkout_started`
- `checkout_completed`

### Sentry Error Tracking
- Frontend errors en Sentry dashboard
- Worker API errors

### Budget Monitoring
```bash
curl https://api.esdetienda.com/chat/budget
# Verificar caps y usage
```

## ⚠️ Configuración de Alertas

### Email Routing
Configurar `soporte@esdetienda.com` para recibir:
- Budget alerts (80% usage)
- Error notifications
- Order notifications

### Cloudflare Notifications
- Worker error rate > 5%
- Pages build failures
- R2 usage alerts

## 🚀 Post-Launch

### 1. Crear Tenant Demo
```bash
curl -X POST https://api.esdetienda.com/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "demo-jose",
    "businessName": "Ferretería José",
    "plan": "pro",
    "ownerEmail": "jose@example.com"
  }'
```

### 2. Importar Productos Demo
- Subir 20-50 SKUs de ejemplo
- Probar búsqueda y filtros
- Verificar imágenes en R2

### 3. WhatsApp Setup
- Configurar WhatsApp Business API
- Webhook: `https://api.esdetienda.com/webhook/whatsapp`
- Probar bot con tenant demo

### 4. Performance Testing
- P95 API response time < 300ms
- Frontend Lighthouse score > 90
- Mobile responsiveness

## 🐛 Troubleshooting

### Worker no responde
- Verificar variables de entorno en Dashboard
- Revisar logs: `wrangler tail`
- Verificar KV/R2/Hyperdrive bindings

### Frontend build falla
- Verificar variables VITE_* en Pages
- Revisar build logs en Dashboard
- Verificar Tailwind config

### MongoDB connection issues
- Verificar Hyperdrive configuration
- Whitelist Cloudflare IPs en Atlas
- Probar connection string

### Budget/IA no funciona
- Verificar OpenRouter API key
- Revisar KV permissions
- Verificar caps en Dashboard

## 💰 Costo Final Estimado

Con configuración optimizada:
- Cloudflare Workers: $5/mes
- R2 Storage: $0-1/mes  
- IA (Nano): $25/mes cap
- IA (Vision): $10/mes cap
- STT: $6/mes cap

**Total: ~$46-47/mes** ✅

## 📈 Next Steps

1. **SEO & Marketing**
   - Configurar Google Analytics
   - Meta tags para redes sociales
   - Sitemap.xml

2. **Features adicionales**
   - Panel de analytics avanzado
   - Sistema de notificaciones
   - Multi-idioma (inglés)

3. **Escalabilidad**
   - Activar Typesense cuando corresponda
   - Implementar Redis cache
   - CDN para imágenes

4. **Business**
   - Stripe/payment integration
   - Facturación automática
   - Support ticketing system
