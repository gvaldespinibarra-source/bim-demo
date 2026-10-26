# CONSTATA — memoria del proyecto

Lee esto al iniciar cualquier sesión de trabajo en este repositorio.

## Qué es
CONSTATA vende estudios laborales (verificación de identidad, escolaridad, historial laboral, domicilio y
referencias) a empresas y despachos en CDMX y zona conurbada. Entrega en 48 h, revisión humana de cada
informe, borrado automático a 6 meses. El informe presenta hechos, nunca un veredicto de "apto / no apto".
Dueño: Ing. Jorge Gustavo Valdespín Ibarra (Gus), director y oficial de privacidad. Gus es nuevo en
programación: explica cada paso en lenguaje sencillo y no des por hecho conocimientos previos.

## Fuentes de diseño (claude.ai, privadas de Gus)
- Arquitectura técnica: https://claude.ai/code/artifact/3f548b8d-4a6b-4238-8a20-e9468055e0f8
- Sitio web, 4 propuestas + pantallas de todos los portales: https://claude.ai/artifact/MrnGUVLC1cuFxST1pHR6cb
- Branding book (4 identidades): https://claude.ai/artifact/JCNPJYsN7xN24bmXc5xDen
- Marca adoptada: **propuesta "Claridad"** (es la que usan todas las pantallas de portales).
  Schibsted Grotesk (títulos) + Hanken Grotesk (texto), tinta #17202B, acento #2140C9,
  logo = círculo con palomita azul + CONSTATA. Todo vive en `packages/marca`.

## Regla de oro: mini apps independientes
Cada función crítica es una app separada en `apps/`, con su propio despliegue en Vercel.
Si una falla, las demás siguen. Se unen bajo un solo dominio con rewrites ("multi-zones")
en `apps/sitio/next.config.mjs`. Ver `docs/02-arquitectura-modular.md`.

- No importes código de una app dentro de otra. Lo compartido va en `packages/`.
- Un cambio en `packages/marca` afecta a todas las apps: pruébalo en todas.

## Comandos
- `npm install` en la raíz instala todo.
- `npm run dev:sitio` → http://localhost:3000
- `npm run typecheck` y `npm run build` antes de cada push.
- Cambios a la base: nueva migración en `supabase/migrations/` (nunca editar una ya aplicada en
  Supabase) y `supabase/probar.sh` debe pasar; agrega una prueba de ataque por cada regla nueva.

## Stack
Next.js 16 (App Router, TypeScript), React 19, npm workspaces. Fuentes autoalojadas con
@fontsource (no se piden a Google). Siguiente: Supabase (Postgres + Auth + Storage) en Fase 1.

## Seguridad (prioridad de Gus, ver `docs/05-seguridad.md`)
- Toda mini app usa `encabezadosSeguridad()` de `packages/seguridad` y `poweredByHeader: false`.
- Validar todo en el servidor; nunca confiar en lo que llega del navegador.
- Permisos por fila en la base desde la primera tabla. Ningún dato real antes de pasar la
  "puerta de control" (sección 6 del plan de seguridad).
- Responsabilidad legal no se delega: se usa infraestructura certificada (Vercel, Supabase),
  contratos y seguro para repartir trabajo y riesgo.

## Datos y legalidad (no negociable)
- Datos de candidatos son personales sensibles (LFPDPPP). Nunca datos reales en el repo, en ejemplos ni en logs.
- Nunca crear campos para salud, embarazo, religión, preferencia sexual, origen étnico, sindicato, política o familiares.
- Textos legales (aviso de privacidad, ARCO, términos) los redacta el abogado; hoy son marcadores.
- Secretos solo en variables de entorno de Vercel, nunca en el código.

## Estado (actualiza esta sección al cerrar cada sesión)
- 2026-10-12: monorepo creado. Mini app `sitio` funcionando (portada, servicios, proceso,
  cumplimiento, paquetes, contacto con validación, páginas /legal y /entrar provisionales).
  El formulario de contacto aún no guarda: solo valida y registra en logs.
- 2026-10-13: Gus aprobó el boceto de 14 funciones independientes (pantallas + motores sobre un
  expediente común) y pidió empezar por seguridad. Hecho: `packages/seguridad` (encabezados),
  formulario endurecido, Dependabot, plan `docs/05-seguridad.md`.
- 2026-10-13: expediente común (`supabase/migrations`), pasos del estudio, RLS y bitácora
  inmodificable; 37 comprobaciones en `supabase/pruebas`, también en CI. Ver `docs/06-expediente.md`.
- Pendiente: reorganizar carpetas de portales a funciones; repo propio `constata-plataforma`
  (Gus debe crearlo vacío); acciones de cuentas de Gus (sección 7 del plan).
