# EsDeTienda - Plataforma SaaS Multi-Tenant

Plataforma SaaS donde comercios se registran, crean su tienda virtual, suben productos, gestionan su bot de WhatsApp, y atienden pedidos/consultas.

## 🏗️ Arquitectura

- **Frontend**: React + Vite + Tailwind + shadcn/ui en Cloudflare Pages
- **Backend**: Cloudflare Workers + Hono + MongoDB Atlas (vía Hyperdrive)
- **Multi-tenant**: Por path `esdetienda.com/{tenantSlug}`
- **API**: Separada en `api.esdetienda.com`
- **IA**: OpenRouter (Nano + 4o-mini) como fallback, no protagonista

## 🚀 Stack Técnico

### Frontend
- React + Vite + TypeScript
- Tailwind CSS + shadcn/ui
- PostHog (analytics) + Sentry (errores)
- Cloudflare Turnstile (anti-bot)

### Backend  
- Cloudflare Workers (edge) + Hono
- MongoDB Atlas vía Hyperdrive
- Cloudflare R2 (almacenamiento)
- KV (caps/contadores por tenant)

### IA & Servicios
- **Texto**: OpenRouter gpt-5-nano (caps US$25/mes)
- **Visión**: OpenRouter gpt-4o-mini (caps US$10/mes) 
- **STT**: Google Speech-to-Text (caps 300 min/mes)

## 📁 Estructura del Monorepo

```
/apps
  /frontend        # React/Vite UI
  /worker-api      # Hono API
/packages  
  /core           # Modelos, schemas, servicios
  /prompts        # Prompts IA (texto y visión)
  /ui             # Componentes compartidos
/infra
  /cloudflare     # Configuración Cloudflare
/scripts          # Seeds y migraciones
```

## 🛠️ Desarrollo

### Setup inicial
```bash
# Clonar el repositorio
git clone <repository-url>
cd esdetienda

# Ejecutar setup automático
chmod +x scripts/setup.sh
./scripts/setup.sh

# O manualmente:
npm install
cp env.example .env
# Editar .env con tus credenciales
```

### Scripts de desarrollo
```bash
# Frontend en http://localhost:5173
npm run dev:frontend

# API Worker en http://localhost:8787  
npm run dev:api

# Ambos simultáneamente
npm run dev
```

### Build y Deploy
```bash
# Build frontend
npm run build:frontend

# Deploy API a Cloudflare
npm run deploy:api

# Deploy completo (automático)
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

## 🌐 Deployment

### 1. Configurar Cloudflare Resources

```bash
# Crear KV Namespace
wrangler kv:namespace create "KV"
wrangler kv:namespace create "KV" --preview

# Crear R2 Bucket  
wrangler r2 bucket create esdetienda-media

# Crear Hyperdrive (requiere MongoDB Atlas URI)
wrangler hyperdrive create esdetienda-db --connection-string="mongodb+srv://user:pass@cluster/db"
```

### 2. Configurar dominios
- Comprar `esdetienda.com` en Cloudflare Registrar
- Pages: conectar repo → asignar `esdetienda.com` 
- Worker: Deploy → Add Custom Domain `api.esdetienda.com`

### 3. Variables de entorno

**Cloudflare Pages (Frontend):**
```bash
VITE_API_URL=https://api.esdetienda.com
VITE_POSTHOG_API_KEY=phc_xxx
VITE_POSTHOG_HOST=https://us.i.posthog.com
VITE_SENTRY_DSN=https://xxx.ingest.sentry.io/xxx
```

**Cloudflare Workers (API):**
```bash
OPENROUTER_API_KEY=sk-or-xxxxx
IA_NANO_BUDGET_USD=25
IA_VISION_BUDGET_USD=10
STT_MINUTES_CAP=300
ASSEMBLYAI_API_KEY=xxx
MONGODB_URI=mongodb+srv://...
POSTHOG_API_KEY=phc_xxx
SENTRY_DSN=https://xxx.ingest.sentry.io/xxx
```

### 4. Deploy

```bash
# Frontend (Cloudflare Pages)
cd apps/frontend
npm run build
# Conectar repo con Pages en Dashboard

# API Worker
cd apps/worker-api
wrangler deploy

# O usar script automático
./scripts/deploy.sh
```

### 5. Configurar headers de seguridad
El archivo `apps/frontend/public/_headers` ya tiene la configuración CSP lista.

## 💰 Meta de Costos (≤US$50/mes)

- Workers Paid: US$5
- R2: US$0-1  
- IA texto (Nano): US$25 cap
- IA visión (4o-mini): US$10 cap
- STT (Google): US$6 cap
- **Total**: ~US$46-47/mes

## 🎯 Características MVP

✅ Multi-tenant por path  
✅ Catálogo de productos con búsqueda  
✅ Bot WhatsApp con botones + IA fallback  
✅ Transcripción de audios  
✅ Análisis de imágenes para búsqueda  
✅ Panel admin con onboarding  
✅ Sistema de caps con alertas  

## 📊 Métricas (PostHog)

- `search_performed`
- `product_viewed`  
- `add_to_cart`
- `checkout_started`
- `checkout_completed`

## 🎨 Branding

Colores principales extraídos del logo:
- **Navy**: `#134572` (primario)
- **Teal**: `#27A3A4` (secundario) 
- **Aqua**: `#90BDC0` (suave)
- **Accent**: `#F79A30` (resaltado)

## 📞 Soporte

- Email: soporte@esdetienda.com
- Horario: 8:00 - 20:00 (UTC-4)
