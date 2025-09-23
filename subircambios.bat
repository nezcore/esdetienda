@echo off
chcp 65001 > nul
cls
echo.
echo ===========================================
echo    🚀 ESDETIENDA - SUBIR CAMBIOS A GITHUB
echo ===========================================
echo.

:: Mostrar estado actual
echo 📊 Estado actual del repositorio:
git status --short
echo.

:: Verificar si hay cambios usando git diff
git diff --quiet
if %errorlevel%==0 (
    git diff --cached --quiet
    if %errorlevel%==0 (
        echo ✅ No hay cambios para subir.
        echo.
        pause
        exit /b 0
    )
)

echo 📝 Hay cambios detectados
echo.

:: Solicitar mensaje de commit
set "COMMIT_MSG="
set /p COMMIT_MSG="💬 Mensaje del commit (Enter para auto): "

:: Si no se proporciona mensaje, usar uno automático
if "%COMMIT_MSG%"=="" (
    set COMMIT_MSG=🔄 Auto-update %date% %time%
)

echo.
echo 📋 Mensaje: "%COMMIT_MSG%"
echo.

:: Confirmar antes de proceder
set "CONFIRM="
set /p CONFIRM="¿Continuar? (S/n): "
if /i "%CONFIRM%"=="n" (
    echo ❌ Cancelado.
    pause
    exit /b 0
)

echo.
echo 🔄 Procesando...
echo.

:: Agregar todos los cambios
echo 📁 Agregando archivos...
git add .
if %errorlevel% neq 0 (
    echo ❌ Error al agregar archivos.
    pause
    exit /b 1
)

:: Crear commit
echo 💾 Creando commit...
git commit -m "%COMMIT_MSG%"
if %errorlevel% neq 0 (
    echo ❌ Error al crear commit.
    pause
    exit /b 1
)

:: Subir a GitHub
echo 🌐 Subiendo a GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo ❌ Error al subir a GitHub.
    echo.
    echo 🔧 Posibles soluciones:
    echo    - Verificar internet
    echo    - git pull origin main
    echo    - Verificar credenciales
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================
echo    ✅ ¡CAMBIOS SUBIDOS EXITOSAMENTE! 🎉
echo ============================================
echo.
echo 🔗 https://github.com/nezcore/esdetienda
echo 📝 "%COMMIT_MSG%"
echo.

:: Mostrar últimos commits
echo 📋 Últimos commits:
git log --oneline -3
echo.

echo ✨ ¡Listo!
echo.
pause
