# otro-felipe.github.io

Sitio estático alojado en GitHub Pages construido con React y Vite.

## Requisitos

- Docker y Docker Compose.

## Desarrollo local

1. Instala dependencias y levanta el servidor de desarrollo:
   ```sh
   docker compose up
   ```
   El sitio quedará disponible en `http://localhost:5173`.

2. Ejecuta cualquier comando adicional dentro del contenedor:
   ```sh
   docker compose run --rm web <comando>
   ```

## Compilar para GitHub Pages

1. Genera la salida estática y copia los artefactos a `docs/`:
   ```sh
   docker compose run --rm web npm run build:pages
   ```
2. Haz commit de `docs/` y `package-lock.json`, luego realiza `git push`.
3. Configura el repositorio para publicar desde la carpeta `docs` en GitHub Pages.

## Estructura

- `src/`: Código fuente del proyecto React.
- `docs/`: Salida lista para publicación en GitHub Pages (generada automáticamente).
- `Dockerfile`: Imagen base usada por Docker Compose.
- `docker-compose.yml`: Define el servicio `web` y el volumen persistente de `node_modules`.
- `scripts/build-pages.mjs`: Copia los artefactos de `dist/` a `docs/`.
