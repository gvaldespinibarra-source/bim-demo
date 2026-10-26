import { razonSocial } from "@/data/contenido";

export function Pie() {
  return (
    <footer className="pie">
      <div className="contenedor">
        <div>{razonSocial} · Ciudad de México</div>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <a href="/legal#aviso">Aviso de privacidad</a>
          <a href="/legal#arco">Derechos ARCO</a>
          <a href="/legal#terminos">Términos y condiciones</a>
        </div>
      </div>
    </footer>
  );
}
