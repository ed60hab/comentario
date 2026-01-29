# Guía: Usar el Editor en la Tablet sin el Mac (Vía Termux)

Si quieres trabajar fuera de casa o sin el Mac encendido, puedes ejecutar el servidor directamente en tu Tablet usando Termux.

## Requisitos Previos
1.  Tener **Termux** instalado en tu Tablet Android.
2.  Tener el repositorio clonado en Termux (ya lo tienes).

## Pasos

### 1. Instalar Node.js en Termux
Abre Termux y ejecuta estos comandos (una sola vez):

```bash
pkg update && pkg upgrade
pkg install nodejs
```

### 2. Preparar el Proyecto
Navega a la carpeta de tu proyecto en Termux. Por ejemplo:

```bash
cd storage/shared/comentario  # (O la ruta donde tengas tu repo)
```

Una vez dentro de la carpeta, instala las dependencias (una sola vez):

```bash
npm install
```

### 3. Iniciar el Servidor
Cada vez que quieras editar, entra a la carpeta y ejecuta:

```bash
node git-server.js
```

Verás el mensaje de que el servidor se ha iniciado en el puerto 3000.

### 4. Abrir el Editor
Ahora, abre Chrome en tu Tablet y ve a:

**http://localhost:3000/editor.html**

¡Listo!

*   Ahora tu Tablet es el servidor.
*   Cuando guardes, se guardará en la Tablet y se subirá a GitHub desde la Tablet.
*   No necesitas el Mac para nada.
