#!/bin/bash

# Script de deploy para Cloudflare Workers
echo "🚀 Desplegando Worker desde la raíz del proyecto..."

# Cambiar al directorio del worker
cd apps/worker-api

# Verificar que existe wrangler.toml
if [ ! -f "wrangler.toml" ]; then
    echo "❌ Error: wrangler.toml no encontrado en apps/worker-api/"
    exit 1
fi

# Ejecutar deploy
echo "📦 Ejecutando wrangler deploy..."
npx wrangler deploy

echo "✅ Deploy completado"
