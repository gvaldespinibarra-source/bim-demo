/*
  Textos y precios del sitio. Edita aquí sin tocar el diseño.
  Precios en pesos, más IVA (fuente: propuesta Claridad, 8 oct 2026).
*/

export const servicios = [
  {
    cifra: "48 h",
    titulo: "Entrega remota",
    texto: "Contadas desde que el candidato termina de cargar sus documentos. Sigues el avance en tu portal.",
  },
  {
    cifra: "1 a 1",
    titulo: "Revisión humana",
    texto: "Automatizamos el cotejo de documentos. Una persona revisa y aprueba cada informe antes de que llegue a ti.",
  },
  {
    cifra: "6 meses",
    titulo: "Borrado automático",
    texto: "El expediente se elimina seis meses después de la entrega, con constancia de borrado.",
  },
];

export const pasos = [
  {
    titulo: "Pides el estudio",
    texto: "Eliges el paquete y los criterios del puesto. La plataforma rechaza criterios discriminatorios.",
  },
  {
    titulo: "El candidato firma",
    texto: "Recibe una liga por correo, SMS o WhatsApp, lee el aviso y firma su consentimiento electrónico.",
  },
  {
    titulo: "Verificamos",
    texto: "Cotejamos documentos con registros públicos, consultamos a sus referentes y, si aplica, hace la videovisita.",
  },
  {
    titulo: "Recibes el informe",
    texto: "Hechos por rubro, con su fuente. Sin calificación de apto o no apto: la decisión es de tu empresa.",
  },
];

export const datosQueNuncaPedimos = [
  "Salud",
  "Embarazo",
  "Religión",
  "Preferencia sexual",
  "Origen étnico",
  "Afiliación sindical",
  "Opiniones políticas",
  "Datos de familiares",
];

export const garantias = [
  { titulo: "Consentimiento con NOM-151", texto: "Firma electrónica y constancia de conservación por cada estudio." },
  { titulo: "Bitácora inmodificable", texto: "Cada acceso y cada cambio queda registrado." },
  { titulo: "Ficha para tu inventario", texto: "Te entregamos la ficha del tratamiento para tu propio cumplimiento." },
  { titulo: "Derechos ARCO", texto: "El candidato tiene un canal para ejercerlos durante y después del estudio." },
];

export type Paquete = {
  nombre: string;
  para: string;
  precio: number;
  entrega: string;
  incluye: string[];
  destacado?: boolean;
};

export const paquetes: Paquete[] = [
  {
    nombre: "Básico",
    para: "Operativos y administrativos",
    precio: 600,
    entrega: "100 % remoto, 48 h",
    incluye: ["Identidad y CURP", "Domicilio documental", "Escolaridad", "Historial con semanas cotizadas", "2 referencias laborales"],
  },
  {
    nombre: "Profesional",
    para: "Licenciados, ingenieros y mandos medios",
    precio: 750,
    entrega: "100 % remoto, 48 a 72 h",
    incluye: ["Todo lo del Básico", "Título y cédula en el registro de la SEP", "Posgrados", "3 referencias laborales"],
  },
  {
    nombre: "Con videovisita",
    para: "Trato con clientes, inventarios o supervisión",
    precio: 850,
    entrega: "Remoto, 72 h",
    incluye: ["Todo lo del Básico", "Videovisita guiada desde su teléfono", "Tipo de vivienda y tiempo de residencia"],
    destacado: true,
  },
  {
    nombre: "Presencial",
    para: "Cuando necesitas visita física",
    precio: 1100,
    entrega: "3 a 5 días hábiles",
    incluye: ["Todo lo del Básico", "Visita con verificador acreditado", "Tipo de vivienda y tiempo de residencia"],
  },
];

export const volumenes = ["1 a 5", "6 a 20", "21 a 50", "Más de 50"];

/** Pendiente: denominación legal de la S.A.S. en constitución. */
export const razonSocial = "[DENOMINACIÓN DE LA S.A.S.]";
