import { pasos, servicios } from "@/data/contenido";

export function Servicios() {
  return (
    <section id="servicios" className="contenedor seccion">
      <h2 className="titulo-seccion" style={{ maxWidth: 760 }}>
        Rápido, revisado por una persona y con fecha de borrado.
      </h2>
      <div className="columnas" style={{ marginTop: 64 }}>
        {servicios.map((s) => (
          <div key={s.titulo}>
            <div className="cifra">{s.cifra}</div>
            <h3 style={{ margin: "18px 0 8px", fontSize: 20, fontWeight: 600 }}>{s.titulo}</h3>
            <p className="suave" style={{ margin: 0 }}>
              {s.texto}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Proceso() {
  return (
    <section id="proceso" className="contenedor seccion">
      <h2 className="titulo-seccion">Así funciona.</h2>
      <ol className="pasos">
        {pasos.map((p, i) => (
          <li key={p.titulo}>
            <div style={{ fontFamily: "var(--f-titulo)", fontWeight: 600, fontSize: 15, color: "var(--c-acento)" }}>
              Paso {i + 1}
            </div>
            <h3 style={{ margin: "8px 0", fontSize: 21, fontWeight: 600 }}>{p.titulo}</h3>
            <p className="suave" style={{ margin: 0, fontSize: 16 }}>
              {p.texto}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
