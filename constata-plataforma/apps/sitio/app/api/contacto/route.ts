import { NextResponse } from "next/server";

/*
  Recibe la solicitud de prueba piloto del sitio.

  Hoy: valida y deja registro en los logs del servidor (Vercel > Logs).
  Siguiente paso (ver docs/04-hoja-de-ruta.md): guardar en la tabla
  `solicitudes_contacto` de Supabase y avisar por correo a la socia comercial,
  para que aparezca en su panel "Solicitudes de contacto".
*/

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TAMANO_MAXIMO = 4_000; // bytes; una solicitud legítima pesa menos de 1 KB

export async function POST(request: Request) {
  // Solo JSON y de tamaño razonable: corta envíos automatizados y cargas gigantes.
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return NextResponse.json({ ok: false }, { status: 415 });
  }
  const cuerpo = await request.text();
  if (cuerpo.length > TAMANO_MAXIMO) {
    return NextResponse.json({ ok: false }, { status: 413 });
  }

  let datos: Record<string, unknown>;
  try {
    datos = JSON.parse(cuerpo);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Campo trampa: invisible para personas, los robots lo llenan. Se responde "ok" sin guardar nada.
  if (typeof datos.sitio_web === "string" && datos.sitio_web !== "") {
    return NextResponse.json({ ok: true });
  }

  const texto = (v: unknown) => (typeof v === "string" ? v.trim().slice(0, 200) : "");
  const solicitud = {
    nombre: texto(datos.nombre),
    empresa: texto(datos.empresa),
    correo: texto(datos.correo),
    volumen: texto(datos.volumen),
  };

  const errores: Record<string, string> = {};
  if (!solicitud.nombre) errores.nombre = "Escribe tu nombre.";
  if (!solicitud.empresa) errores.empresa = "Escribe el nombre de tu empresa.";
  if (!CORREO.test(solicitud.correo)) errores.correo = "Revisa tu correo; parece incompleto.";
  if (Object.keys(errores).length > 0) {
    return NextResponse.json({ ok: false, errores }, { status: 422 });
  }

  console.info("[contacto] nueva solicitud de piloto", {
    empresa: solicitud.empresa,
    volumen: solicitud.volumen,
    recibida: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
