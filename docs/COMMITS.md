# Convención de mensajes de commit

Formato sugerido, alineado con Conventional Commits:

```
<tipo>(<ámbito opcional>): <descripción en imperativo>

[cuerpo opcional]

[pie opcional: referencias a issues, rupturas de compatibilidad]
```

## Tipos frecuentes

| Tipo | Cuándo usarlo |
|------|----------------|
| `feat` | Nueva funcionalidad visible para el usuario |
| `fix` | Corrección de errores |
| `docs` | Solo documentación |
| `style` | Formato, espacios, sin cambiar lógica |
| `refactor` | Cambio interno sin nuevo comportamiento ni fix |
| `test` | Añadir o corregir pruebas |
| `chore` | Mantenimiento (CI, dependencias, tareas auxiliares) |
| `perf` | Mejora de rendimiento |

## Reglas

- Mensaje de la primera línea breve (idealmente hasta 72 caracteres).
- Descripción en **imperativo** ("añade", "corrige", no "añadido", "corrigiendo").
- Un concepto por commit; si mezcla temas, dividir en varios commits.
- Commits **frecuentes** con unidades lógicas pequeñas facilitan revisión y `git bisect`.

## Ejemplos

```
feat(paleta): muestra nombres aproximados de color en español
fix(carga): mantiene la URL del blob hasta cargar la vista previa
docs(gitflow): describe ramas release y hotfix
chore(ci): valida sintaxis de app.js en GitHub Actions
```
