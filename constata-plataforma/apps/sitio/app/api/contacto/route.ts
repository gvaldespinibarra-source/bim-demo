import { NextResponse } from "next/server";

/*
  Recibe la solicitud de prueba piloto del sitio.

  Hoy: valida y deja registro en los logs del servidor (Vercel > Logs).
  Siguiente paso (ver docs/04-hoja-de-ruta.md): guardar en la tabla
  `solicitudes_contacto` de Supabase y avisar por correo a la socia comercial,
  para que aparezca en su panel "Solicitudes de contacto".
*/

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let datos: Record<string, unknown>;
  try {
    datos = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
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
