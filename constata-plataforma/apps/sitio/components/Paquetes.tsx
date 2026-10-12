import { paquetes } from "@/data/contenido";

const pesos = (n: number) => "$" + n.toLocaleString("es-MX");

export function Paquetes() {
  return (
    <section id="paquetes" className="contenedor seccion">
      <h2 className="titulo-seccion">Elige el estudio según el puesto.</h2>
      <p className="suave" style={{ margin: "16px 0 0" }}>
        Precios en pesos, más IVA. Descuento para clientes con 10 o más estudios al mes.
      </p>
      <div className="paquetes">
        {paquetes.map((p) => (
          <div key={p.nombre} className={`paquete${p.destacado ? " paquete-destacado" : ""}`}>
            <h3 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>{p.nombre}</h3>
            <p className="suave" style={{ margin: "6px 0 0", fontSize: 15 }}>
              {p.para}
            </p>
            <div className="precio">{pesos(p.precio)}</div>
            <div className="suave" style={{ fontSize: 14 }}>
              {p.entrega}
            </div>
            <ul>
              {p.incluye.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Despachos() {
  return (
    <section className="contenedor" style={{ paddingTop: 120 }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 40,
          alignItems: "center",
          padding: "clamp(28px, 5vw, 56px)",
          borderRadius: 28,
          background: "var(--c-acento-fondo)",
        }}
      >
        <div style={{ flex: "2 1 420px" }}>
          <h2
            style={{
              margin: 0,
              fontWeight: 700,
              fontSize: "clamp(28px, 3.4vw, 40px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Para despachos contables, jurídicos y de ingeniería.
          </h2>
          <p style={{ margin: "16px 0 0", color: "var(--c-texto)" }}>
            Contratas poco y contratas profesionistas. El paquete Profesional confirma título, cédula y trayectoria sin
            que tengas que llamar a nadie.
          </p>
        </div>
        <a href="#contacto" className="boton boton-oscuro" style={{ flex: "0 0 auto" }}>
          Hablar con nosotros
        </a>
      </div>
    </section>
  );
}
