# Conflictos y fusiones

## Antes de fusionar

1. Actualizar la rama local con la rama destino del PR (`git fetch`, luego `git merge origin/develop` o `git rebase origin/develop` según política del equipo).
2. Resolver conflictos en el editor: conservar la intención de ambas partes cuando sea posible; si hay duda, coordinar con quien escribió el otro bloque.
3. Ejecutar localmente las mismas comprobaciones que CI (`node --check app.js` y prueba manual en el navegador).
4. Subir la rama actualizada y comprobar que el PR pasa CI de nuevo.

## Durante la revisión

- Los revisores comentan líneas concretas; el autor responde con commits adicionales o explicaciones.
- No fusionar con conflictos sin resolver ni con CI fallando.
- Si el conflicto es amplio, conviene una sesión breve o un commit intermedio documentado en el PR.

## Tras la fusión

- Verificar que `develop` o `master` reflejan el estado esperado.
- Si un hotfix tocó `master`, comprobar que los mismos cambios llegaron a `develop` para evitar regresiones en el siguiente release.
