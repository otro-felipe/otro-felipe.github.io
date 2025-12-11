# Agent Guidelines

- Siempre ejecuta comandos mediante `docker compose run --rm web <comando>`; evita correr procesos directamente en la máquina local.
- Registra en este archivo cualquier instrucción o consideración nueva o corrección que el usuario indique para futuros contextos.
- Incluye esta política de toma de notas cuando agregues instrucciones nuevas, asegurando que los agentes recuerden actualizar este documento ante cambios.
- Antes de modificar componentes existentes, revisa cuidadosamente la versión y el patrón de uso vigente (ej. el `Grid` actual usa la prop `size` en lugar de `item xs`). Ajustarse a ese estilo evita regresiones de layout.
- Usa el tema central en `src/theme/appTheme.js` para cambiar estilos globales (colores, `borderRadius`, etc.) en vez de duplicar overrides en cada componente.
- Los comandos de búsqueda y de acceso al sistema de archivos pueden ejecutarse directamente en la máquina; reserva `docker compose run --rm web <comando>` para interactuar con la aplicación o sus dependencias.
- Al trabajar con imágenes de cartas, construye las URLs siguiendo el formato existente (`https://static.dotgg.gg/riftbound/cards/<CÓDIGO>.webp`) y mejora la redacción final manteniendo la lógica de reglas proporcionada por el usuario.
- Para resaltar keywords, usa exclusivamente los marcadores `<reaction>`, `<action>`, `<deathknell>`, `<shield n>`, `<assault n>`, `<tank>`, `<deflect>` y `<temporary>` (insensibles a mayúsculas); son los únicos reconocidos por el decorador. Mantén esta política de toma de notas actualizada si cambia.
