import { cp, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');
const distDir = resolve(projectRoot, 'dist');
const docsDir = resolve(projectRoot, 'docs');

if (!existsSync(distDir)) {
  console.error('No se encontró la carpeta dist. Ejecuta "npm run build" primero.');
  process.exit(1);
}

console.log('Preparando carpeta docs para GitHub Pages...');
await rm(docsDir, { recursive: true, force: true });
await mkdir(docsDir, { recursive: true });
await cp(distDir, docsDir, { recursive: true });
console.log('Carpeta docs actualizada correctamente.');

const indexHtmlPath = resolve(docsDir, 'index.html');
const notFoundPath = resolve(docsDir, '404.html');

if (existsSync(indexHtmlPath)) {
  await cp(indexHtmlPath, notFoundPath);
  console.log('Archivo 404.html generado para compatibilidad con rutas.');
} else {
  console.warn('No se encontró index.html en docs; no se pudo generar 404.html.');
}
