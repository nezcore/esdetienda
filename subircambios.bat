@echo off
chcp 65001 > nul
cls
echo.
echo ============================================
echo    🚀 ESDETIENDA - AUTO COMMIT Y PUSH
echo ============================================
echo.

:: Verificar si hay cambios
git diff --quiet
if %errorlevel%==0 (
    git diff --cached --quiet
    if %errorlevel%==0 (
        echo ✅ No hay cambios para subir.
        echo ⏱️  Cerrando en 5 segundos...
        timeout /t 5 > nul
        exit
    )
)

:: Leer el número del último commit o inicializar en 1
set COMMIT_NUM=1
if exist .commit_counter (
    set /p COMMIT_NUM=<.commit_counter
)

:: Incrementar el número
set /a NEXT_NUM=%COMMIT_NUM%+1

:: Guardar el nuevo número para la próxima vez
echo %NEXT_NUM% > .commit_counter

:: Crear mensaje automático con número
set COMMIT_MSG=Update #%NEXT_NUM%

echo 📝 Cambios detectados
echo 📋 Commit #%NEXT_NUM%
echo.

:: Agregar todos los cambios
echo 📁 Agregando archivos...
git add .
if %errorlevel% neq 0 (
    echo ❌ Error al agregar archivos.
    echo ⏱️  Cerrando en 5 segundos...
    timeout /t 5 > nul
    exit
)

:: Crear commit
echo 💾 Creando commit #%NEXT_NUM%...
git commit -m "%COMMIT_MSG%"
if %errorlevel% neq 0 (
    echo ❌ Error al crear commit.
    echo ⏱️  Cerrando en 5 segundos...
    timeout /t 5 > nul
    exit
)

:: Subir a GitHub
echo 🌐 Subiendo a GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo ❌ Error al subir a GitHub.
    echo    Verifica tu conexión e intenta de nuevo.
    echo ⏱️  Cerrando en 5 segundos...
    timeout /t 5 > nul
    exit
)

echo.
echo ============================================
echo    ✅ ¡COMMIT #%NEXT_NUM% SUBIDO! 🎉
echo ============================================
echo.
echo 🔗 https://github.com/nezcore/esdetienda
echo 📝 "%COMMIT_MSG%"
echo.
echo ⏱️  Cerrando en 5 segundos...
timeout /t 5 > nul
exit
