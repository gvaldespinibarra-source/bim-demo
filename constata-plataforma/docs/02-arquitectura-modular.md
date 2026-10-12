# Arquitectura modular: mini apps

## La idea

Cada función crítica del sistema es una aplicación separada, con su propia carpeta, su propia
publicación en Vercel y su propia liga. Al final se ven como un solo sitio porque comparten dominio
y marca. Si una falla, solo esa ruta deja de responder; las demás siguen funcionando, y se puede
reparar y volver a publicar esa sola parte.

```
constata.mx/            → apps/sitio      (público)
constata.mx/entrar      → apps/acceso     (inicio de sesión + doble factor)
constata.mx/empresa     → apps/empresa    (portal de la empresa cliente)
constata.mx/candidato   → apps/candidato  (portal del candidato, en su teléfono)
constata.mx/director    → apps/director   (revisión y aprobación)
constata.mx/comercial   → apps/comercial  (clientes y contactos)
```

## Cómo se unen ("multi-zones" de Next.js)

`apps/sitio` es la puerta principal. En `apps/sitio/next.config.mjs` hay una lista de rutas que,
cuando se define la variable de entorno correspondiente en Vercel (por ejemplo `URL_APP_ACCESO`),
se envían a la app que las atiende. Mientras la variable no exista, el sitio muestra su página
provisional (por eso `/entrar` hoy dice "El acceso abre pronto").

Cada app que viva bajo una ruta debe declarar `basePath` en su propio `next.config.mjs`
(por ejemplo `basePath: "/empresa"`).

## Qué se comparte y qué no

| Compartido (en `packages/`) | Independiente (en cada `apps/…`) |
|---|---|
| `marca`: colores, fuentes, logo, etiquetas de estatus | Pantallas y lógica de su función |
| Más adelante: `datos` (tipos y cliente de Supabase) | Su despliegue y sus variables de entorno |
| | Sus errores: no afectan a las demás |

Regla: una app nunca importa código de otra app. Si dos apps necesitan lo mismo, se mueve a `packages/`.

## Un solo lugar para los datos

Las mini apps son independientes en código, pero todas leen y escriben en la **misma base de datos**
(Supabase), con permisos por fila: una empresa solo ve sus estudios, un candidato solo su expediente.
Esto lo define el documento de arquitectura técnica (secciones 4 a 6).

## Pruebas automáticas

`.github/workflows/ci.yml` compila cada mini app por separado en cada cambio. Si una no compila,
GitHub lo marca en rojo antes de que llegue a publicarse, y señala exactamente cuál.
