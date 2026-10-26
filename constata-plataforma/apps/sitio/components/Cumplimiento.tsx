import { datosQueNuncaPedimos, garantias } from "@/data/contenido";

export function Cumplimiento() {
  return (
    <section id="cumplimiento" className="banda-oscura">
      <div
        className="contenedor"
        style={{ padding: "120px 24px", display: "flex", flexWrap: "wrap", gap: 64, alignItems: "flex-start" }}
      >
        <div style={{ flex: "1 1 400px" }}>
          <h2 className="titulo-seccion">Hay preguntas que nunca hacemos.</h2>
          <p style={{ margin: "24px 0 0", maxWidth: 460, color: "var(--c-oscuro-texto)", fontSize: 18 }}>
            Nuestros formularios no tienen campos para estos datos. Si aparecen por error en un texto o un video, se
            marcan y se eliminan. Así protegemos al candidato y a tu empresa de multas por tratar datos sensibles.
          </p>
        </div>
        <ul className="tachados" style={{ flex: "1 1 380px" }} aria-label="Datos que nunca pedimos">
          {datosQueNuncaPedimos.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>
      <div className="contenedor" style={{ paddingBottom: 120 }}>
        <div
          style={{
            borderTop: "1px solid var(--c-oscuro-linea)",
            paddingTop: 48,
            display: "flex",
            flexWrap: "wrap",
            gap: 40,
          }}
        >
          {garantias.map((g) => (
            <div key={g.titulo} style={{ flex: "1 1 220px" }}>
              <h3 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 600 }}>{g.titulo}</h3>
              <p style={{ margin: 0, color: "var(--c-oscuro-texto)", fontSize: 15 }}>{g.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
