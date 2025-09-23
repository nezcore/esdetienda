#!/bin/bash

# Script de setup inicial para EsDeTienda
echo "🚀 Configurando EsDeTienda..."

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instalar Node.js 18+ primero."
    exit 1
fi

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado."
    exit 1
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env desde ejemplo..."
    cp env.example .env
    echo "⚠️  IMPORTANTE: Edita el archivo .env con tus credenciales reales antes de continuar."
fi

# Verificar si Wrangler está instalado
if ! command -v wrangler &> /dev/null; then
    echo "🔧 Instalando Wrangler CLI..."
    npm install -g wrangler
fi

echo "✅ Setup completado!"
echo ""
echo "Próximos pasos:"
echo "1. Editar .env con tus credenciales"
echo "2. Crear recursos de Cloudflare:"
echo "   - wrangler kv:namespace create \"KV\""
echo "   - wrangler r2 bucket create esdetienda-media"  
echo "   - wrangler hyperdrive create esdetienda-db --connection-string=\"tu-mongodb-uri\""
echo "3. Ejecutar 'npm run dev' para desarrollo"
echo "4. Ejecutar 'npm run deploy:api' para deployment"
