import type { Metadata } from "next";
import "@constata/marca/fuentes";
import "@constata/marca/tokens.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "CONSTATA · Estudios laborales con hechos verificados",
  description:
    "Verificamos identidad, escolaridad, historial laboral y domicilio de tus candidatos en 48 horas, con su consentimiento firmado. CDMX y zona conurbada.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX">
      <body>{children}</body>
    </html>
  );
}
