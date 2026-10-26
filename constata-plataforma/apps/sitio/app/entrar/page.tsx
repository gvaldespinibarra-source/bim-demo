import type { Metadata } from "next";
import { Encabezado } from "@/components/Encabezado";
import { Pie } from "@/components/Pie";

export const metadata: Metadata = { title: "Entrar · CONSTATA" };

/*
  Lugar provisional. Cuando la mini app "acceso" esté publicada y se defina
  URL_APP_ACCESO en Vercel, next.config.mjs envía /entrar a esa app y esta
  página deja de mostrarse.
*/
export default function Entrar() {
  return (
    <>
      <Encabezado />
      <main className="pagina-simple" style={{ textAlign: "center" }}>
        <h1 style={{ margin: 0, fontSize: 40, letterSpacing: "-0.02em" }}>El acceso abre pronto</h1>
        <p className="suave" style={{ margin: "16px auto 0", maxWidth: 480 }}>
          Estamos preparando el portal para empresas cliente. Mientras tanto, solicita tu prueba piloto y te
          atendemos directamente.
        </p>
        <div
          className="mensaje"
          style={{ margin: "28px auto 0", maxWidth: 480, background: "var(--c-acento-claro)", color: "var(--c-acento-hover)" }}
        >
          ¿Eres candidato? No necesitas cuenta: entra con la liga personal que recibiste por correo, SMS o WhatsApp.
        </div>
        <a href="/#contacto" className="boton boton-primario" style={{ marginTop: 32 }}>
          Solicitar prueba piloto
        </a>
      </main>
      <Pie />
    </>
  );
}
