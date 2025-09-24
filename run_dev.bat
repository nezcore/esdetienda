@echo off
setlocal

REM Ir a la raíz del proyecto (ubicación del script)
CD /D %~dp0

REM Instalar dependencias raíz si no existen
IF NOT EXIST node_modules (
  echo Instalando dependencias en el directorio raíz...
  npm install
)

REM Lanzar frontend (Vite) en nueva ventana
start "Frontend" cmd /c "cd apps\frontend && IF NOT EXIST node_modules npm install && npm run dev"

REM Lanzar backend (Cloudflare Worker) en nueva ventana
start "API" cmd /c "cd apps\worker-api && IF NOT EXIST node_modules npm install && wrangler dev"

echo.
echo Frontend y backend iniciados en ventanas separadas.
echo Cierra esta ventana para detener ambos procesos.
echo.
pause
