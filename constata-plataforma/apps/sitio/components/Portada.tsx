import { Estatus, type TipoEstatus } from "@constata/marca";

const rubrosEjemplo: { rubro: string; detalle: string; estatus: TipoEstatus }[] = [
  { rubro: "Identidad y CURP", detalle: "Coincide con la consulta pública de CURP", estatus: "verificado" },
  { rubro: "Domicilio", detalle: "Videovisita con ubicación y número exterior visibles", estatus: "verificado" },
  {
    rubro: "Historial laboral",
    detalle: "La fecha de salida declarada difiere de la constancia de semanas cotizadas",
    estatus: "discrepancia",
  },
  { rubro: "Referencia laboral 2", detalle: "El referente no respondió en el plazo", estatus: "no-verificable" },
];

export function Portada() {
  return (
    <section id="inicio" className="contenedor portada">
      <p className="suave" style={{ margin: "0 0 18px", fontSize: 18 }}>
        Estudios laborales para empresas y despachos en CDMX y zona conurbada
      </p>
      <h1>Hechos verificados. La decisión es tuya.</h1>
      <p className="entrada">
        Verificamos identidad, escolaridad, historial laboral y domicilio de tus candidatos en 48 horas, con su
        consentimiento firmado y sin pedir un solo dato que la ley protege.
      </p>
      <div className="ctas">
        <a href="#contacto" className="boton boton-primario">
          Solicitar prueba piloto
        </a>
        <a href="#paquetes" className="boton boton-texto">
          Ver paquetes y precios
        </a>
      </div>

      <figure className="informe" aria-label="Ejemplo de informe de hallazgos con estatus por rubro">
        <div className="informe-cabecera">
          <div>
            <div style={{ fontFamily: "var(--f-titulo)", fontWeight: 600, fontSize: 18 }}>Informe de hallazgos</div>
            <div className="suave" style={{ fontSize: 14 }}>
              Folio [CST-000000] · Puesto: Supervisor de almacén · Paquete Estándar con videovisita
            </div>
          </div>
          <Estatus tipo="aprobado" />
        </div>
        {rubrosEjemplo.map((r) => (
          <div key={r.rubro} className="informe-fila">
            <div style={{ flex: "1 1 200px", fontWeight: 600 }}>{r.rubro}</div>
            <div className="suave" style={{ flex: "2 1 280px", fontSize: 15 }}>
              {r.detalle}
            </div>
            <Estatus tipo={r.estatus} />
          </div>
        ))}
        <figcaption className="informe-pie">
          Este informe presenta hechos verificados. No constituye una recomendación de contratación.
        </figcaption>
      </figure>
    </section>
  );
}
