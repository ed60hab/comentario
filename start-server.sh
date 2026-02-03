#!/bin/bash

# Script para iniciar el servidor en macOS/Linux
echo "╔════════════════════════════════════════════╗"
echo "║  Iniciando Servidor Git Automático (Mac)  ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Obtener el directorio del script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

# Verificar si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias por primera vez..."
    npm install
    echo "✅ Dependencias instaladas"
    echo ""
fi

echo "🚀 Iniciando servidor..."
echo ""
node git-server.js
