import { Contacto } from "@/components/Contacto";
import { Cumplimiento } from "@/components/Cumplimiento";
import { Encabezado } from "@/components/Encabezado";
import { Despachos, Paquetes } from "@/components/Paquetes";
import { Pie } from "@/components/Pie";
import { Portada } from "@/components/Portada";
import { Proceso, Servicios } from "@/components/Servicios";

export default function Inicio() {
  return (
    <>
      <Encabezado />
      <main>
        <Portada />
        <Servicios />
        <Proceso />
        <Cumplimiento />
        <Paquetes />
        <Despachos />
        <Contacto />
      </main>
      <Pie />
    </>
  );
}
