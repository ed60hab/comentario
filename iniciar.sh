#!/data/data/com.termux/files/usr/bin/bash

# Script generado automáticamente por setup_widget.sh

# Asegurar ruta correcta
cd "/data/data/com.termux/files/home/comentario" || { echo "❌ No encuentro carpeta /data/data/com.termux/files/home/comentario"; read -p "Enter..."; exit 1; }

echo "🌐 Abriendo navegador..."
# Intentamos abrir la URL (background)
termux-open-url http://localhost:3000/editor.html &

echo "⚡ Iniciando servidor desde /data/data/com.termux/files/home/comentario..."
# Iniciamos nodo
node git-server.js

echo "❌ El servidor se cerró inesperadamente."
read -p "Presiona Enter para cerrar..."
