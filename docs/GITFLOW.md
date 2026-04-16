# GitFlow en paletaViva

## Ramas permanentes

| Rama | Propósito |
|------|-----------|
| `master` | Producción estable. Solo entra código probado vía `release` o `hotfix` fusionados con revisión. |
| `develop` | Integración continua. Punto de partida de `feature` y destino de fusiones de características antes de un release. |

## Ramas de soporte

| Prefijo | Uso | Origen | Destino típico |
|---------|-----|--------|----------------|
| `feature/` | Nuevas funciones o mejoras no urgentes | `develop` | `develop` vía pull request |
| `release/` | Preparar versión (ajes finales, versión, notas) | `develop` | `master` y `develop` vía pull requests |
| `hotfix/` | Corrección urgente en producción | `master` | `master` y `develop` vía pull requests |

## Flujo resumido

1. **Característica:** crear `feature/nombre-corto` desde `develop`, commits frecuentes con mensajes convencionales, abrir PR hacia `develop`, revisión obligatoria, CI en verde, fusionar sin commits de merge innecesarios (squash o merge según acuerdo del equipo).
2. **Release:** cuando `develop` está listo, crear `release/x.y.z` desde `develop`, solo cambios de release, PR a `master` y otro PR de vuelta a `develop` si aplica.
3. **Hotfix:** desde `master`, rama `hotfix/descripcion`, PR a `master`, luego PR o merge de los mismos commits hacia `develop` para no perder la corrección.

## Pull requests

Toda integración a `master` o `develop` se hace mediante **pull request** en GitHub: al menos una revisión, comprobación de CI y resolución explícita de conflictos antes de fusionar.

## Ajustes en GitHub

En **Settings → Branches**, reglas de protección para `master` y `develop`: exigir pull request antes de fusionar, opcionalmente varias aprobaciones, y el estado de verificación **ci** obligatorio. Desactivar el bypass de administradores si se busca cumplimiento estricto.
