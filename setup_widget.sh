#!/bin/bash

# setup_widget.sh
# Este script configura automáticamente el entorno en Termux para el usuario.
# Se descarga vía git pull y se ejecuta con bash setup_widget.sh

echo "🤖 Iniciando configuración automática del Widget..."

# 1. Definir rutas
# Intentamos detectar la ruta real del proyecto actual
PROJECT_DIR=$(pwd)
SHORTCUTS_DIR="$HOME/.shortcuts"
SHORTCUT_FILE="$SHORTCUTS_DIR/iniciar"

echo "📂 Carpeta del proyecto detectada: $PROJECT_DIR"

# 2. Crear carpeta de atajos
if [ ! -d "$SHORTCUTS_DIR" ]; then
    echo "mkdir -p $SHORTCUTS_DIR"
    mkdir -p "$SHORTCUTS_DIR"
fi

# 3. Crear el archivo del script del widget
# Usamos 'cat' con el shebang correcto de Termux
echo "📝 Creando archivo $SHORTCUT_FILE..."

cat << EOF > "$SHORTCUT_FILE"
#!/data/data/com.termux/files/usr/bin/bash

# Script generado automáticamente por setup_widget.sh

# Asegurar ruta correcta
cd "$PROJECT_DIR" || { echo "❌ No encuentro carpeta $PROJECT_DIR"; read -p "Enter..."; exit 1; }

echo "🌐 Abriendo navegador..."
# Intentamos abrir la URL (background)
termux-open-url http://localhost:3000/editor.html &

echo "⚡ Iniciando servidor desde $PROJECT_DIR..."
# Iniciamos nodo
node git-server.js

echo "❌ El servidor se cerró inesperadamente."
read -p "Presiona Enter para cerrar..."
EOF

# 4. Dar permisos
echo "🔑 Asignando permisos de ejecución..."
chmod +x "$SHORTCUT_FILE"

echo ""
echo "✅ ¡INSTALACIÓN COMPLETADA!"
echo "-----------------------------------"
echo "Ahora:"
echo "1. Ve a la pantalla de inicio de tu Tablet."
echo "2. Añade el widget 'Termux:Widget'."
echo "3. Selecciona 'iniciar'."
echo "-----------------------------------"
