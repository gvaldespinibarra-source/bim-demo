"use client";

import { useState, type FormEvent } from "react";
import { volumenes } from "@/data/contenido";

type Estado = "inicial" | "enviando" | "enviado" | "error";

export function Contacto() {
  const [estado, setEstado] = useState<Estado>("inicial");
  const [errores, setErrores] = useState<Record<string, string>>({});

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;

    setEstado("enviando");
    setErrores({});
    try {
      const r = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      const cuerpo = await r.json();
      if (r.ok) {
        setEstado("enviado");
      } else {
        setErrores(cuerpo.errores ?? {});
        setEstado("error");
      }
    } catch {
      setEstado("error");
    }
  }

  return (
    <section
      id="contacto"
      className="contenedor seccion"
      style={{ paddingBottom: 120, display: "flex", flexWrap: "wrap", gap: 64 }}
    >
      <div style={{ flex: "1 1 360px" }}>
        <h2 className="titulo-seccion">Prueba piloto con precio preferente.</h2>
        <p className="suave" style={{ margin: "20px 0 0", maxWidth: 440, fontSize: 18 }}>
          Haz de 3 a 5 estudios con nosotros y compáralos con tu proveedor actual.
        </p>
      </div>

      {estado === "enviado" ? (
        <div style={{ flex: "1 1 420px" }}>
          <p className="mensaje mensaje-ok" role="status">
            Recibimos tu solicitud. Te escribiremos en un día hábil para agendar el piloto.
          </p>
        </div>
      ) : (
        <form className="formulario" style={{ flex: "1 1 420px" }} onSubmit={enviar} noValidate>
          <Campo nombre="nombre" etiqueta="Nombre" autoComplete="name" error={errores.nombre} />
          <Campo nombre="empresa" etiqueta="Empresa" autoComplete="organization" error={errores.empresa} />
          <Campo nombre="correo" etiqueta="Correo" tipo="email" autoComplete="email" error={errores.correo} />
          <label className="campo">
            Estudios al mes
            <select name="volumen" defaultValue={volumenes[0]}>
              {volumenes.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <p className="completo suave" style={{ margin: 0, fontSize: 13 }}>
            Usaremos estos datos solo para contactarte sobre el piloto. Consulta el{" "}
            <a href="/legal#aviso">aviso de privacidad</a>.
          </p>
          {estado === "error" && Object.keys(errores).length === 0 && (
            <p className="completo mensaje mensaje-error" role="alert">
              No pudimos enviar tu solicitud. Intenta de nuevo en un momento.
            </p>
          )}
          <button
            type="submit"
            className="completo boton boton-primario"
            style={{ justifySelf: "start" }}
            disabled={estado === "enviando"}
          >
            {estado === "enviando" ? "Enviando…" : "Solicitar prueba piloto"}
          </button>
        </form>
      )}
    </section>
  );
}

function Campo(props: { nombre: string; etiqueta: string; tipo?: string; autoComplete: string; error?: string }) {
  const idError = `${props.nombre}-error`;
  return (
    <label className="campo">
      {props.etiqueta}
      <input
        name={props.nombre}
        type={props.tipo ?? "text"}
        autoComplete={props.autoComplete}
        required
        aria-invalid={props.error ? true : undefined}
        aria-describedby={props.error ? idError : undefined}
      />
      {props.error && (
        <span id={idError} className="error-campo">
          {props.error}
        </span>
      )}
    </label>
  );
}
