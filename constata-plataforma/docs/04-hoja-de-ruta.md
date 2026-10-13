# Hoja de ruta

Orden pensado para tener algo útil publicado cuanto antes y no tocar datos de candidatos
hasta que el aspecto legal y la seguridad estén listos.

## Etapa 0 · Seguridad base (prioridad, ver `05-seguridad.md`)
- [x] Encabezados de seguridad compartidos (`packages/seguridad`) aplicados al sitio
- [x] Formulario protegido: validación en servidor, límite de tamaño, campo trampa
- [x] Dependabot y CI configurados
- [ ] Gus: gestor de contraseñas y doble factor en GitHub, Vercel, Supabase, correo y dominio
- [ ] Activar escaneo de secretos y protección de la rama `main` en el repo propio
- [ ] Firewall de Vercel con límite de intentos al publicar
- [ ] Cotizar póliza de ciberriesgo y prueba de penetración
- [x] Expediente común: tablas, pasos del estudio, permisos por fila y bitácora inmodificable (`docs/06-expediente.md`)
- [x] 37 comprobaciones de seguridad de la base, automáticas en cada cambio

## Etapa 1 · Presencia (en curso)
- [x] Monorepo y marca compartida
- [x] Mini app `sitio` con diseño Claridad, formulario de piloto con validación
- [ ] Publicar en Vercel (ver guía, 10 minutos)
- [ ] Comprar dominio y conectarlo
- [ ] Definir razón social de la S.A.S. y ponerla en el pie

## Etapa 2 · Captar clientes
- [ ] Crear proyecto Supabase y aplicar el expediente (plan Pro al tener clientes reales)
- [ ] Guardar solicitudes de piloto en Supabase y avisar por correo
- [ ] Mini app `comercial`: ver solicitudes de contacto y dar de alta empresas

## Etapa 3 · Acceso seguro
- [ ] Mini app `acceso`: contraseña + doble factor (obligatorio para personal)
- [ ] Bitácora de accesos desde el primer día

## Etapa 4 · Operación del estudio (requiere textos del abogado)
- [ ] Aviso de privacidad, consentimiento y ARCO redactados por el abogado
- [ ] Proveedor de firma con constancia NOM-151 elegido
- [ ] Mini app `candidato`: aviso, firma, datos, documentos, envío
- [ ] Mini app `empresa`: solicitar, seguir, descargar informe
- [ ] Mini app `director`: revisar, aprobar, bitácora
- [ ] Borrado automático a 6 meses

## Etapa 5 · Crecimiento
- [ ] Borrador de informe con modelo de lenguaje, siempre con aprobación humana
- [ ] Notificaciones por WhatsApp
- [ ] Facturación CFDI
- [ ] Migración a AWS México cuando un cliente lo exija o se superen 100 estudios al mes
