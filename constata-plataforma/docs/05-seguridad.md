# Plan de seguridad

Versión 0.1 · 13 de octubre de 2026 · Validar con el abogado los puntos legales.

## 1. La pregunta de fondo: ¿podemos quitarnos la responsabilidad?

**La responsabilidad legal no se puede delegar; el trabajo y parte del riesgo, sí.**

Contratar servidores certificados no te quita la responsabilidad: la ley de datos personales
(LFPDPPP, publicada el 20 de marzo de 2025; la autoridad ahora es la Secretaría Anticorrupción y Buen
Gobierno) obliga a quien trata los datos a tomar medidas de seguridad, sin importar dónde estén los
servidores. Lo que sí se puede hacer es repartir la carga en tres direcciones:

| Qué se transfiere | A quién | Cómo |
|---|---|---|
| **El trabajo técnico** de proteger servidores, red, parches, centro de datos | Proveedores certificados (Vercel, Supabase) | No tener servidores propios. Usar servicios administrados |
| **El riesgo económico** de un incidente | Aseguradora | Póliza de ciberriesgo (cotizar con un corredor) |
| **Las obligaciones** de cada parte | Clientes y proveedores | Contratos: encargado de tratamiento con cada cliente, acuerdo de tratamiento de datos (DPA) con cada proveedor |

Analogía de obra: contratar una constructora certificada no libera al director responsable de obra.
Pero sí reparte el trabajo, y el seguro y los contratos definen quién paga qué.

## 2. Quién cuida qué (modelo de responsabilidad compartida)

| Lo cuida el proveedor | Lo cuidamos nosotros |
|---|---|
| Edificio, servidores, discos, energía | Quién tiene acceso a las cuentas (contraseñas y doble factor) |
| Red, ataques masivos de saturación (DDoS) básicos | Que cada empresa solo vea lo suyo (permisos por fila) |
| Parches del sistema operativo y de la base de datos | El código de la plataforma y sus librerías |
| Cifrado del disco y respaldos automáticos | Qué datos pedimos y cuándo los borramos |
| Sus auditorías ISO 27001 y SOC 2 Tipo 2 | Bitácora, revisión de accesos y respuesta a incidentes |

Proveedores elegidos y su estado:
- **Vercel** (publica el sitio): ISO 27001:2022 y SOC 2 Tipo 2.
- **Supabase** (base de datos, inicio de sesión, archivos): SOC 2 Tipo 2 e ISO 27001.
  El reporte SOC 2 completo solo se entrega en planes Team o Enterprise; para empezar basta saber que existe.
- **AWS región México** en Fase 2, cuando un cliente exija los datos en México.

**La causa más común de filtraciones no es un hackeo sofisticado: es una configuración mal hecha
o una contraseña robada.** Ahí debemos enfocar el esfuerzo.

## 3. La mejor defensa: no tener el dato

Lo que no guardas no te lo pueden robar.

- **No pedir lo que no se necesita.** Los formularios no tienen campos para datos sensibles (salud,
  religión, etc.). Esto ya está en el diseño.
- **Borrar a los 6 meses**, automáticamente y con constancia. Solo se conserva la huella (hash) del informe.
- **No copiar datos fuera de la plataforma**: nada de expedientes en correo, WhatsApp o en una USB.
  Los informes se descargan desde un enlace que caduca en 15 minutos.
- **Nunca datos reales** en el código, en pruebas ni en los registros (logs).

## 4. Las capas de protección

| Capa | Medida | Estado |
|---|---|---|
| **Navegador** | Encabezados de seguridad: política de contenido (CSP), HTTPS obligatorio, anti-marcos | ✅ Hecho (`packages/seguridad`) |
| **Formularios** | Validación en el servidor, límite de tamaño, campo trampa contra robots | ✅ Hecho (contacto) |
| **Tráfico** | Firewall de Vercel con reglas contra abuso y límite de intentos | Al publicar |
| **Identidad** | Doble factor obligatorio en GitHub, Vercel, Supabase, correo y para el personal en la plataforma | Pendiente (acciones de Gus, sección 7) |
| **Identidad** | Candidato entra con liga única que caduca en 72 h; bloqueo tras 5 intentos fallidos | Al construir `acceso` y `candidato` |
| **Datos** | Permisos por fila en la base: una empresa nunca ve datos de otra | Al crear la base |
| **Datos** | Cifrado en tránsito (TLS) y en reposo; campos sensibles cifrados aparte | Al crear la base |
| **Datos** | Bitácora inmodificable escrita por la propia base de datos | Al crear la base |
| **Código** | Revisión automática en cada cambio (CI) | ✅ Hecho |
| **Código** | Alertas semanales de librerías con fallas conocidas (Dependabot) | ✅ Configurado; se activa al pasar al repo propio |
| **Código** | Escaneo de secretos de GitHub (evita subir contraseñas por error) | Activar en el repo propio |
| **Proceso** | Respaldos diarios y prueba de restauración cada trimestre | Al crear la base |
| **Proceso** | Plan de respuesta a incidentes (quién hace qué, en qué orden, a quién se avisa) | Redactar con el abogado |

## 5. Ataques comunes y cómo nos defendemos

| Ataque | Qué es | Defensa |
|---|---|---|
| Robo de contraseña / phishing | Engañan a alguien para que entregue su contraseña | Doble factor en todo; con él, la contraseña sola no sirve |
| Configuración expuesta | Una tabla o archivo queda abierto al público por error | Permisos por fila desde el día uno; revisor de seguridad de Supabase; lista de verificación antes de publicar |
| Ver datos de otro cliente | Cambiar un número en la liga para ver otro expediente | Permisos por fila en la base, no solo en las pantallas |
| Inyección de código (XSS, SQL) | Meter código en un formulario para que el sistema lo ejecute | CSP (hecho); React escapa textos; consultas sin SQL armado a mano |
| Librerías vulnerables | Un componente de terceros tiene una falla | Dependabot + CI; actualizar en cuanto haya parche |
| Robots y spam | Llenan formularios en masa | Campo trampa (hecho), firewall y límite de intentos |
| Saturación (DDoS) | Inundan el sitio de tráfico | Protección incluida en Vercel |
| Abuso interno | Alguien con acceso consulta lo que no debe | Mínimo privilegio + bitácora que nadie puede borrar |

## 6. Antes del primer dato real de un candidato (puerta de control)

Ningún candidato real entra a la plataforma hasta que todo esto esté en verde:

- [ ] Doble factor activo en todas las cuentas de la sección 7
- [ ] Permisos por fila probados: una empresa de prueba intenta ver datos de otra y no puede
- [ ] Bitácora funcionando y probada
- [ ] Borrado a 6 meses probado con datos de prueba
- [ ] Respaldo restaurado con éxito al menos una vez
- [ ] Aviso de privacidad, consentimiento y procedimiento ARCO redactados por el abogado
- [ ] Contrato de encargado de tratamiento listo para firmar con clientes
- [ ] DPA aceptado con Vercel y Supabase (ambos lo ofrecen)
- [ ] Plan de respuesta a incidentes escrito
- [ ] Prueba de penetración externa (un especialista intenta entrar) — cotizar
- [ ] Póliza de ciberriesgo — cotizar con corredor

## 7. Acciones de Gus (cuentas)

Estas no las puedo hacer yo; son de tus cuentas personales:

1. **Gestor de contraseñas** (1Password, Bitwarden o el de tu iPhone) y una contraseña distinta y larga por cuenta.
2. **Doble factor con app autenticadora** (no SMS) en: GitHub, Vercel, Supabase, el correo del dominio
   y el registrador del dominio.
3. **Correo del negocio** en un dominio propio (Google Workspace o Microsoft 365) con doble factor,
   no cuentas personales.
4. **Candado del dominio** (registrar lock) al comprarlo, para que nadie lo transfiera.
5. Cuando tu socia tenga acceso: **cuentas separadas**, nunca compartir contraseñas.
