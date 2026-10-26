import type { Metadata } from "next";
import { Encabezado } from "@/components/Encabezado";
import { Pie } from "@/components/Pie";

export const metadata: Metadata = { title: "Aviso de privacidad y términos · CONSTATA" };

/* Los textos legales los redacta el abogado. Esta página solo reserva su lugar. */
export default function Legal() {
  return (
    <>
      <Encabezado />
      <main className="pagina-simple">
        <h1 style={{ margin: 0, fontSize: 40, letterSpacing: "-0.02em" }}>Documentos legales</h1>
        <p className="pendiente" style={{ marginTop: 24 }}>
          Pendiente: textos en revisión con el abogado. No publicar el sitio con clientes reales hasta tenerlos.
        </p>

        <h2 id="aviso" style={{ marginTop: 56 }}>Aviso de privacidad</h2>
        <p className="suave">[TEXTO DEL AVISO DE PRIVACIDAD INTEGRAL]</p>

        <h2 id="arco" style={{ marginTop: 40 }}>Derechos ARCO</h2>
        <p className="suave">[PROCEDIMIENTO Y CORREO PARA ACCESO, RECTIFICACIÓN, CANCELACIÓN Y OPOSICIÓN]</p>

        <h2 id="terminos" style={{ marginTop: 40 }}>Términos y condiciones</h2>
        <p className="suave">[TÉRMINOS Y CONDICIONES DEL SERVICIO]</p>
      </main>
      <Pie />
    </>
  );
}
