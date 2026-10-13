# El expediente: el cimiento común

Todas las funciones de la plataforma leen y escriben en un mismo lugar: el expediente de cada
estudio, guardado en la base de datos (Supabase). Las reglas de seguridad viven **en la base**,
no en las pantallas. Si una pantalla tiene un error, la base igual se niega a entregar datos
que no corresponden.

Archivo: `supabase/migrations/20261013000000_expediente.sql`

## Qué guarda

| Tabla | Qué es | ¿Datos personales? |
|---|---|---|
| `empresas` | Clientes de CONSTATA | No (datos de empresa) |
| `perfiles` | Usuarios con cuenta: director, comercial, usuarios de empresa | Nombre del usuario |
| `estudios` | Un estudio: folio, empresa, puesto, paquete, paso actual | No |
| `candidatos` | Nombre y contacto del candidato | **Sí**, se borra a los 6 meses |
| `rubros` | Resultado de cada verificación (identidad, domicilio…) | **Sí**, se borra a los 6 meses |
| `solicitudes_contacto` | Pedidos de prueba piloto del sitio | Contacto comercial |
| `bitacora` | Quién hizo qué y cuándo | No: guarda qué columnas cambiaron, nunca los valores |

## Los pasos de un estudio

```
solicitado → esperando_candidato → en_captura → en_verificacion → en_revision → entregado → borrado
     └────────────── cualquiera puede pasar a "cancelado" ──────────────┘            ↑
                                        en_revision puede regresar a en_verificacion  │
                                                         cancelado → borrado ─────────┘
```

Reglas que la base hace cumplir:
- No se saltan pasos.
- **Solo el director entrega**: ni la socia comercial, ni un proceso automático, ni la IA.
- No se entrega sin la huella (SHA-256) del informe aprobado.
- Al entregar se fija la fecha de borrado: 6 meses después.
- Al pasar a `borrado` se eliminan candidato y resultados; quedan folio, fechas y huella.
- La empresa y el folio de un estudio nunca cambian.

## Quién ve qué

| | Visitante sin sesión | Empresa cliente | Socia comercial | Director |
|---|---|---|---|---|
| Sus estudios | — | Solo los suyos | Todos | Todos |
| Estudios de otra empresa | — | Nunca | Todos | Todos |
| Resultados del informe | — | Solo cuando ya fue entregado | Todos | Todos |
| Bitácora | — | — | — | Solo lectura |
| Cambiar el paso del estudio | — | — | Sí, menos entregar | Sí |

## Cómo se comprueba

`supabase/probar.sh` crea una base desechable con datos ficticios y lanza 37 comprobaciones: una empresa
que intenta ver lo de otra, ascenderse a director, saltar pasos, entregar sin aprobación, borrar
la bitácora, etc. Si cualquiera tiene éxito, se detiene con "FALLA DE SEGURIDAD". Corre
automáticamente en GitHub con cada cambio.

## Límite honesto

Un administrador con acceso total a la base podría, en teoría, desactivar la protección de la
bitácora. Para cerrar eso (Fase 2) se enviará una copia diaria de la bitácora a un almacén externo
de solo escritura. Mientras tanto, la llave de administración solo la tiene el director, con doble factor.

## Cuando creemos el proyecto en Supabase

1. Crear el proyecto (región más cercana disponible) y activar doble factor en la cuenta.
2. Aplicar la migración con la CLI de Supabase (`supabase db push`); yo te guío en ese paso.
3. Ejecutar el revisor de seguridad de Supabase ("Security Advisor") y verificar que no haya alertas.
