@echo off
title Servidor Git Automático - Comentarios Bíblicos
color 0A

echo.
echo ╔════════════════════════════════════════════╗
echo ║  Iniciando Servidor Git Automático...     ║
echo ╚════════════════════════════════════════════╝
echo.

cd /d "C:\Users\ed60h\Documents\Dev\comentario"

REM Verificar si node_modules existe
if not exist "node_modules" (
    echo 📦 Instalando dependencias por primera vez...
    echo.
    call npm install
    echo.
    echo ✅ Dependencias instaladas
    echo.
)

echo 🚀 Iniciando servidor...
echo.
node git-server.js

pause
