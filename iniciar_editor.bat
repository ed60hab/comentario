@echo off
title Iniciando Editor de Comentarios...
color 0A

echo.
echo ╔══════════════════════════════════════════╗
echo ║   Arrancando Sistema de Comentarios...   ║
echo ╚══════════════════════════════════════════╝
echo.

cd /d "%~dp0"

:: Iniciar el servidor minimizado
start /min cmd /c "node git-server.js"

:: Esperar 2 segundos para dar tiempo al servidor
timeout /t 2 /nobreak >nul

:: Abrir el navegador
start http://localhost:3000/editor.html

echo.
echo ✅ ¡Listo! El editor debería haberse abierto en tu navegador.
echo ⚠️  No cierres la ventana minimizada del servidor mientras trabajes.
echo.
timeout /t 5
