/** @type {import('next').NextConfig} */
const nextConfig = {
  // La marca vive en packages/marca como código fuente; Next la compila junto con la app.
  transpilePackages: ["@constata/marca"],

  // Unión de mini apps ("multi-zones"): cuando cada portal esté publicado,
  // el sitio redirige sus rutas a la app correspondiente bajo el mismo dominio.
  // Si una app falla, solo su ruta deja de responder; el sitio sigue arriba.
  // Se activan al definir las variables de entorno en Vercel.
  async rewrites() {
    const zonas = [
      ["/entrar", process.env.URL_APP_ACCESO],
      ["/empresa", process.env.URL_APP_EMPRESA],
      ["/candidato", process.env.URL_APP_CANDIDATO],
      ["/director", process.env.URL_APP_DIRECTOR],
      ["/comercial", process.env.URL_APP_COMERCIAL],
    ].filter(([, url]) => Boolean(url));
    // "beforeFiles": la app publicada gana sobre la página provisional del sitio (p. ej. /entrar).
    return {
      beforeFiles: zonas.flatMap(([ruta, url]) => [
        { source: ruta, destination: `${url}${ruta}` },
        { source: `${ruta}/:path*`, destination: `${url}${ruta}/:path*` },
      ]),
    };
  },
};

export default nextConfig;
