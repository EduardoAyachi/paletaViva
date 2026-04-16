# paletaViva

Web estática en español: extrae una paleta de colores desde una imagen (archivo o portapapeles).

## Documentación del repositorio

| Documento | Contenido |
|-----------|-----------|
| [docs/GITFLOW.md](docs/GITFLOW.md) | Ramas `master`, `develop`, `feature`, `release`, `hotfix` y uso de pull requests |
| [docs/COMMITS.md](docs/COMMITS.md) | Convención de mensajes de commit |
| [docs/CONFLICTOS.md](docs/CONFLICTOS.md) | Cómo abordar conflictos y revisiones antes de fusionar |

## CI/CD

- **Integración continua:** validación de sintaxis de `app.js` y presencia de archivos estáticos en cada push a `master` o `develop` y en pull requests (workflow `.github/workflows/ci.yml`).
- **Entrega continua:** despliegue automático a **GitHub Pages** al hacer push a `master` (mismo workflow, trabajo `deploy`). En el repositorio: *Settings → Pages → Build and deployment → Source: GitHub Actions*.

## Rama `develop`

La rama `develop` agrupa integración previa a releases. Las características se fusionan a `develop` mediante PR; `master` recibe releases y hotfixes también vía PR.

## Licencia

Especificar según el criterio del autor del proyecto.
