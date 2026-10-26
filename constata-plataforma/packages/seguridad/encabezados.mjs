/*
  Encabezados de seguridad para todas las mini apps.
  Se aplican en next.config.mjs de cada app:  headers: async () => encabezadosSeguridad()

  Qué evita cada uno, en corto:
  - Content-Security-Policy: que el navegador ejecute código o cargue recursos de otros sitios
    (inyección de scripts, robo de datos hacia servidores ajenos).
  - Strict-Transport-Security: que alguien fuerce una conexión sin cifrar.
  - X-Frame-Options / frame-ancestors: que otro sitio meta el nuestro en un marco para engañar clics.
  - X-Content-Type-Options: que el navegador "adivine" tipos de archivo y ejecute uno disfrazado.
  - Referrer-Policy: que las ligas con datos (p. ej. la liga única del candidato) se filtren a otros sitios.
  - Permissions-Policy: cámara, micrófono y ubicación apagados salvo donde se pidan a propósito.
*/

const esDesarrollo = process.env.NODE_ENV !== "production";

/**
 * @param {{ camara?: boolean, conectarA?: string[] }} [opciones]
 *   camara: true solo en la mini app de videovisita.
 *   conectarA: dominios externos a los que la app necesita hablar (p. ej. el de Supabase).
 */
export function encabezadosSeguridad(opciones = {}) {
  const conectar = ["'self'", ...(opciones.conectarA ?? [])].join(" ");
  const csp = [
    "default-src 'self'",
    // Next.js inserta pequeños scripts en línea; en desarrollo además usa eval para recarga en vivo.
    `script-src 'self' 'unsafe-inline'${esDesarrollo ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    `connect-src ${conectar}${esDesarrollo ? " ws:" : ""}`,
    "media-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(esDesarrollo ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");

  const encabezados = [
    { key: "Content-Security-Policy", value: csp },
    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "no-referrer" },
    {
      key: "Permissions-Policy",
      value: `camera=(${opciones.camara ? "self" : ""}), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()`,
    },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ];

  return [{ source: "/:path*", headers: encabezados }];
}
