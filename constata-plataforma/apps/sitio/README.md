# Mini app: sitio

Sitio público de CONSTATA, diseño "Claridad". Es la puerta principal: también reparte las rutas
de las demás mini apps cuando están publicadas (ver `next.config.mjs`).

```bash
npm run dev:sitio   # desde la raíz → http://localhost:3000
```

| Qué cambiar | Dónde |
|---|---|
| Precios, servicios, pasos, datos que nunca pedimos | `data/contenido.ts` |
| Una sección de la página | `components/` (una por sección) |
| Orden de las secciones | `app/page.tsx` |
| Qué pasa al enviar el formulario | `app/api/contacto/route.ts` |
| Textos legales (pendientes del abogado) | `app/legal/page.tsx` |
