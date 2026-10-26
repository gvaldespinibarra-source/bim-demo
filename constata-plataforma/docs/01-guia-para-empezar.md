# Guía para empezar

Esta guía es para ti, Gus: lo mínimo que necesitas saber para dirigir el proyecto sin ser programador.

## Las piezas, en una frase cada una

| Pieza | Qué es | Analogía de obra |
|---|---|---|
| **GitHub (repositorio)** | Donde vive el código y su historial completo de cambios | El archivo de planos con todas sus revisiones |
| **Commit** | Un cambio guardado con su descripción | Una revisión de plano con su nota |
| **Rama (branch)** | Una copia de trabajo para probar cambios sin tocar la versión buena | Un juego de planos "para revisión" |
| **Pull request (PR)** | Solicitud para pasar los cambios de una rama a la versión principal | La aprobación de la revisión antes de emitirla |
| **Vercel** | El servicio que publica el sitio en internet | La obra construida a partir de los planos aprobados |
| **Supabase** | La base de datos y el inicio de sesión | El archivo físico con candado |
| **Mini app** | Una parte del sistema que funciona sola | Un módulo prefabricado |

## Cómo trabajamos juntos

1. Me dices qué quieres en tus palabras ("quiero que el formulario guarde las solicitudes").
2. Yo hago el cambio en una **rama**, lo pruebo y lo subo a GitHub.
3. Vercel publica automáticamente una **vista previa** de esa rama con su propia liga.
4. Tú revisas la vista previa en tu teléfono o computadora.
5. Si te gusta, apruebas el PR y se publica en el sitio real. Si no, me dices qué cambiar.

Nunca se publica nada sin que lo hayas visto antes.

## Publicar el sitio (una sola vez)

1. Crea una cuenta en https://vercel.com entrando con tu cuenta de GitHub.
2. "Add New → Project" y elige el repositorio `constata-plataforma`.
3. En "Root Directory" escribe `apps/sitio`. Deja lo demás como viene.
4. "Deploy". En un par de minutos tienes una liga pública.
5. Después, en "Settings → Domains", conectas el dominio cuando lo compres.

Cada mini app nueva será otro proyecto de Vercel apuntando a su carpeta (`apps/acceso`, etc.).

## Dónde cambiar cosas sencillas

- **Precios, textos de servicios y pasos:** `apps/sitio/data/contenido.ts`
- **Colores y fuentes de toda la plataforma:** `packages/marca/src/tokens.css`
- **Razón social del pie de página:** `razonSocial` en `apps/sitio/data/contenido.ts`

## Para que Claude recuerde el proyecto

El archivo `CLAUDE.md` en la raíz es la memoria del proyecto. Claude lo lee al empezar cada sesión.
Al cerrar una sesión de trabajo, pide: "actualiza el estado en CLAUDE.md".
