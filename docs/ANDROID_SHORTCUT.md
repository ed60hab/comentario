# Crear Acceso Rápido en Termux (Android)

Para abrir el editor con un solo comando (ej. escribiendo `iniciar` o `./iniciar.sh`), sigue estos pasos en Termux.

### 1. Instalar herramienta para abrir URLs
Ejecuta esto en Termux para instalar `termux-tools`:

```bash
pkg install termux-tools
```

### 2. Crear el script de inicio
Vamos a crear un archivo llamado `iniciar.sh` en la carpeta del proyecto. copia y pega este bloque entero en Termux:

```bash
cat << 'EOF' > iniciar.sh
#!/data/data/com.termux/files/usr/bin/bash

# 1. Asegurar ruta correcta
cd "$HOME/comentario" || { echo "❌ No encuentro la carpeta comentario"; read -p "Enter para salir"; exit 1; }

# 2. Abrir el navegador automáticamente
# (El & al final permite que siga ejecutándose lo siguiente)
echo "🌐 Abriendo navegador..."
termux-open-url http://localhost:3000/editor.html &

# 3. Iniciar el servidor
echo "⚡ Iniciando servidor..."
node git-server.js

# Si el servidor falla, pausa para leer el error
echo "❌ El servidor se cerró."
read -p "Presiona Enter para cerrar..."
EOF
```

### 3. Dar permisos de ejecución
Ahora haz que el archivo sea ejecutable:

```bash
chmod +x iniciar.sh
```

### 4. ¡Listo!
Ahora, cada vez que entres a la carpeta, solo tienes que escribir:

```bash
./iniciar.sh
```


You can automate this further by adding a widget to your home screen!

### 5. (Opcional) Icono en el Escritorio (HomeScreen)
Para tener un icono real:

1.  Instala **Termux:Widget**.
2.  Ejecuta esto en Termux para crear el script **directamente en la carpeta de atajos** (más fácil):

    ```bash
    # 1. Crear carpeta de atajos
    mkdir -p "$HOME/.shortcuts"

    # 2. Crear el script allí directamente
    cat << 'EOF' > "$HOME/.shortcuts/iniciar"
    #!/data/data/com.termux/files/usr/bin/bash
    cd "$HOME/comentario" || { echo "❌ No encuentro carpeta"; read -p "Enter..."; exit 1; }
    echo "🌐 Navegador..."
    termux-open-url http://localhost:3000/editor.html &
    echo "⚡ Servidor..."
    node git-server.js
    echo "❌ Cierre inesperado."
    read -p "Enter..."
    EOF

    # 3. Dar permisos
    chmod +x "$HOME/.shortcuts/iniciar"
    ```

3.  Ve a la pantalla de inicio -> Widgets -> Termux:Widget.
4.  ¡Pulsa "iniciar" y listo!
