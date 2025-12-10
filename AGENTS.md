# Agent Guidelines

- Siempre ejecuta comandos mediante `docker compose run --rm web <comando>`; evita correr procesos directamente en la máquina local.
- Registra en este archivo cualquier instrucción nueva o corrección que el usuario indique para futuros contextos.
- Incluye esta política de toma de notas cuando agregues instrucciones nuevas, asegurando que los agentes recuerden actualizar este documento ante cambios.
- Antes de modificar componentes existentes, revisa cuidadosamente la versión y el patrón de uso vigente (ej. el `Grid` actual usa la prop `size` en lugar de `item xs`). Ajustarse a ese estilo evita regresiones de layout.
- Si el texto deja de envolver, confirma que `Typography` no tenga `noWrap` e introduce reglas como `textWrap`/`overflowWrap` en `sx` para mantener el flujo sin reestructurar el layout.
- Usa el tema central en `src/theme/appTheme.js` para cambiar estilos globales (colores, `borderRadius`, etc.) en vez de duplicar overrides en cada componente.
- Usa siempre el `Grid` estándar (`@mui/material/Grid`) salvo que el proyecto indique explícitamente `Grid2`; mezclar ambos rompe la compatibilidad y el layout existente.
- Los comandos de búsqueda y de acceso al sistema de archivos pueden ejecutarse directamente en la máquina; reserva `docker compose run --rm web <comando>` para interactuar con la aplicación o sus dependencias.
