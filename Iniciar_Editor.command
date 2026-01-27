#!/bin/bash

# Este archivo puede moverse al Escritorio.

# 1. Navegar a la carpeta del proyecto (Ruta absoluta para que funcione desde el escritorio)
PROJECT_DIR="/Users/ed60hab/comentario"

if [ -d "$PROJECT_DIR" ]; then
    cd "$PROJECT_DIR"
else
    echo "❌ Error: No se encuentra la carpeta del proyecto en $PROJECT_DIR"
    read -p "Presiona Enter para salir..."
    exit 1
fi

echo "📂 Carpeta: $(pwd)"
echo "🚀 Preparando entorno..."

# 2. Programar la apertura del navegador (espera 7 segundos para dar tiempo al servidor)
# Se ejecuta en segundo plano (&) para no bloquear
(sleep 7 && open "http://localhost:3000/editor.html") &

# 3. Iniciar el servidor (bloqueante - mantendrá la ventana abierta)
echo "⚡ Iniciando servidor... (No cierres esta ventana)"
./start-server.sh
