# CONSTATA · plataforma

Estudios laborales con hechos verificados. Este repositorio contiene el sitio público y, poco a poco,
los portales de la plataforma, cada uno como una **mini app independiente**.

| Mini app | Para quién | Estado |
|---|---|---|
| [`apps/sitio`](apps/sitio) | Público: presenta el servicio y recibe solicitudes de piloto | ✅ Funciona |
| [`apps/acceso`](apps/acceso) | Empresas y personal: entrar con contraseña + doble factor | Planeada |
| [`apps/empresa`](apps/empresa) | Empresa cliente: pedir estudios, seguirlos, descargar informes | Planeada |
| [`apps/candidato`](apps/candidato) | Candidato, en su teléfono: aviso, firma, datos, documentos | Planeada |
| [`apps/director`](apps/director) | Director: revisar y aprobar informes, bitácora | Planeada |
| [`apps/comercial`](apps/comercial) | Socia comercial: clientes, contactos, altas | Planeada |
| [`packages/marca`](packages/marca) | Compartido: colores, fuentes, logo, etiquetas de estatus | ✅ |

## Ver el sitio en tu computadora

Necesitas [Node.js 22](https://nodejs.org) instalado. Luego, en una terminal dentro de esta carpeta:

```bash
npm install        # descarga lo necesario (solo la primera vez)
npm run dev:sitio  # enciende el sitio
```

Abre http://localhost:3000. Los cambios que guardes se ven al instante.

## Documentación

1. [Guía para empezar](docs/01-guia-para-empezar.md): conceptos básicos, cómo trabajar con Claude y cómo publicar.
2. [Arquitectura modular](docs/02-arquitectura-modular.md): por qué mini apps y cómo se unen.
3. [Mapa de pantallas](docs/03-mapa-de-pantallas.md): qué pantalla del diseño va en qué mini app.
4. [Hoja de ruta](docs/04-hoja-de-ruta.md): el orden en que vamos a construir.
