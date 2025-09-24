# Script para configurar la base de datos en Supabase
# Este script lee las credenciales de .dev.vars y ejecuta el SQL

Write-Host "Configurando base de datos en Supabase..." -ForegroundColor Cyan

# Verificar que existe el archivo .dev.vars
if (!(Test-Path "apps/worker-api/.dev.vars")) {
    Write-Host "ERROR: No se encontró el archivo apps/worker-api/.dev.vars" -ForegroundColor Red
    Write-Host "Por favor, crea el archivo con las credenciales de Supabase" -ForegroundColor Yellow
    exit 1
}

# Leer las credenciales
$envContent = Get-Content "apps/worker-api/.dev.vars" -Raw
$supabaseUrl = ""
$supabaseServiceKey = ""

# Extraer SUPABASE_URL
if ($envContent -match 'SUPABASE_URL=(.+)') {
    $supabaseUrl = $matches[1].Trim()
}

# Extraer SUPABASE_SERVICE_KEY
if ($envContent -match 'SUPABASE_SERVICE_KEY=(.+)') {
    $supabaseServiceKey = $matches[1].Trim()
}

if ([string]::IsNullOrEmpty($supabaseUrl) -or [string]::IsNullOrEmpty($supabaseServiceKey)) {
    Write-Host "ERROR: No se encontraron las credenciales de Supabase en .dev.vars" -ForegroundColor Red
    exit 1
}

Write-Host "OK: Credenciales encontradas" -ForegroundColor Green
Write-Host "URL: $supabaseUrl" -ForegroundColor Gray

# Leer el archivo SQL
$sqlContent = Get-Content "scripts/create_tables.sql" -Raw

# Ejecutar el SQL usando la API de Supabase
try {
    Write-Host "Ejecutando script SQL..." -ForegroundColor Yellow
    
    $headers = @{
        "apikey" = $supabaseServiceKey
        "Authorization" = "Bearer $supabaseServiceKey"
        "Content-Type" = "application/json"
    }
    
    $body = @{
        query = $sqlContent
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/rpc/exec_sql" -Method POST -Headers $headers -Body $body
    
    Write-Host "OK: Tablas creadas exitosamente" -ForegroundColor Green
    
} catch {
    Write-Host "ERROR: Error ejecutando SQL: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Alternativa: Copia y pega el contenido de scripts/create_tables.sql en el SQL Editor de Supabase" -ForegroundColor Yellow
    Write-Host "URL del SQL Editor: https://supabase.com/dashboard/project/[tu-proyecto]/sql" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. Verifica que las tablas se crearon en el dashboard de Supabase" -ForegroundColor White
Write-Host "2. Prueba crear una tienda desde el frontend" -ForegroundColor White
Write-Host "3. Revisa los logs del backend para verificar la conexión" -ForegroundColor White
