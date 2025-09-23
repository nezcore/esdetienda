#!/bin/bash

# Script de deployment para EsDeTienda
echo "🚀 Desplegando EsDeTienda..."

# Verificar que estamos en el directorio correcto
if [ ! -f package.json ]; then
    echo "❌ Ejecutar desde la raíz del proyecto"
    exit 1
fi

# Build del frontend
echo "🔨 Building frontend..."
cd apps/frontend
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Error en build del frontend"
    exit 1
fi
cd ../..

# Deploy del Worker API
echo "🚀 Desplegando Worker API..."
cd apps/worker-api
wrangler deploy
if [ $? -ne 0 ]; then
    echo "❌ Error en deploy del Worker API"
    exit 1
fi
cd ../..

echo "✅ Deployment completado!"
echo ""
echo "Próximos pasos:"
echo "1. Configurar dominio custom en Cloudflare Pages para el frontend"
echo "2. Configurar dominio custom api.esdetienda.com para el Worker"
echo "3. Actualizar variables de entorno en Cloudflare Dashboard"
echo "4. Probar endpoints con: curl https://api.esdetienda.com/health"
