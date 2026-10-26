type LogoProps = {
  /** "claro" para fondos blancos, "oscuro" para el panel del director. */
  tono?: "claro" | "oscuro";
  /** Tamaño del símbolo en px; el nombre escala con él. */
  tamano?: number;
};

/** Círculo con palomita + CONSTATA en Schibsted Grotesk. */
export function Logo({ tono = "claro", tamano = 26 }: LogoProps) {
  const tinta = tono === "claro" ? "var(--c-tinta)" : "#ffffff";
  const palomita = tono === "claro" ? "var(--c-acento)" : "#8fa5ff";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: tamano * 0.38, color: tinta }}>
      <svg width={tamano} height={tamano} viewBox="0 0 26 26" fill="none" aria-hidden="true">
        <circle cx="13" cy="13" r="11.5" stroke={tinta} strokeWidth="2" />
        <path
          d="M8 13.4l3.4 3.4L18.2 9.6"
          stroke={palomita}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        style={{
          fontFamily: "var(--f-titulo)",
          fontWeight: 700,
          fontSize: tamano * 0.73,
          letterSpacing: "0.06em",
        }}
      >
        CONSTATA
      </span>
    </span>
  );
}
