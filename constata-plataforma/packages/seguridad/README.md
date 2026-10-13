# @constata/seguridad

Reglas de seguridad compartidas. Toda mini app las usa en su `next.config.mjs`:

```js
import { encabezadosSeguridad } from "@constata/seguridad/encabezados";
// ...
poweredByHeader: false,
headers: async () => encabezadosSeguridad(),
```

Ver el plan completo en `docs/05-seguridad.md`.
