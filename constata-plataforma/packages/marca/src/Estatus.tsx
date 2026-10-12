export type TipoEstatus = "verificado" | "discrepancia" | "no-verificable" | "cancelado" | "aprobado";

const ESTILOS: Record<TipoEstatus, { texto: string; color: string; fondo: string }> = {
  verificado: { texto: "Verificado", color: "var(--c-ok)", fondo: "var(--c-ok-fondo)" },
  aprobado: { texto: "Aprobado por revisión humana", color: "var(--c-ok)", fondo: "var(--c-ok-fondo)" },
  discrepancia: { texto: "Con discrepancia", color: "var(--c-aviso)", fondo: "var(--c-aviso-fondo)" },
  "no-verificable": { texto: "No verificable", color: "var(--c-neutro)", fondo: "var(--c-neutro-fondo)" },
  cancelado: { texto: "Cancelado", color: "var(--c-error)", fondo: "var(--c-error-fondo)" },
};

/** Etiqueta de estatus de un rubro del informe. El texto siempre acompaña al color. */
export function Estatus({ tipo, texto }: { tipo: TipoEstatus; texto?: string }) {
  const e = ESTILOS[tipo];
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 14,
        fontWeight: 600,
        color: e.color,
        background: e.fondo,
        padding: "5px 12px",
        borderRadius: tipo === "aprobado" ? "var(--r-pastilla)" : "var(--r-chico)",
        whiteSpace: "nowrap",
      }}
    >
      {texto ?? e.texto}
    </span>
  );
}
