import { Logo } from "@constata/marca";

export function Encabezado() {
  return (
    <header className="encabezado">
      <nav aria-label="Principal" className="contenedor">
        <a href="/#inicio" className="marca" aria-label="CONSTATA, inicio">
          <Logo />
        </a>
        <div className="enlaces-nav">
          <a href="/#servicios">Servicios</a>
          <a href="/#proceso">Cómo funciona</a>
          <a href="/#cumplimiento">Cumplimiento</a>
          <a href="/#paquetes">Precios</a>
        </div>
        <div className="acciones-nav">
          <a href="/entrar" className="enlace-entrar">
            Entrar
          </a>
          <a href="/#contacto" className="boton boton-primario boton-chico">
            Solicitar piloto
          </a>
        </div>
      </nav>
    </header>
  );
}
