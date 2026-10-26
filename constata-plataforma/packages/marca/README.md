# @constata/marca

Identidad visual compartida por todas las mini apps (propuesta "Claridad").

- `src/tokens.css`: colores, fuentes, radios. Cambiar aquí cambia toda la plataforma.
- `src/fuentes.ts`: Schibsted Grotesk y Hanken Grotesk, servidas desde el propio sitio.
- `<Logo tono="claro|oscuro" />`: círculo con palomita + CONSTATA.
- `<Estatus tipo="verificado|discrepancia|no-verificable|cancelado|aprobado" />`: etiquetas del informe.

En cada app: importar `@constata/marca/fuentes` y `@constata/marca/tokens.css` en `app/layout.tsx`,
y agregar `transpilePackages: ["@constata/marca"]` en `next.config.mjs`.
