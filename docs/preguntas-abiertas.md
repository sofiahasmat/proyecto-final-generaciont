# Preguntas abiertas
La spec no las define; no se implementan hasta resolverlas. Respondé "OK" para aceptar la propuesta provisoria o indicá el cambio.

## Abiertas
| ID | Pregunta | Propuesta provisoria |
|---|---|---|
| PA-24 | **Lista de espera, alta:** ¿para anotarse rige la anticipación máxima (7/3 días)? ¿Se puede anotar quien ya tiene ese turno, o dos veces al mismo turno? | Rige la anticipación máxima; no a ambas cosas. |
| PA-25 | **Lista de espera, cola y retención:** durante los 30 min de una oferta, ¿el turno queda retenido para ese usuario? Si rechaza o vence, ¿sale de la cola de ese turno? Si hay cola, ¿el turno cancelado pasa primero por la cola antes de publicarse? Si la cola se agota, ¿vuelve a estar libre para todos? | Sí a las cuatro. |
| PA-26 | **Ofertas y mínimo de 15 min (RN-22):** ¿se generan ofertas si faltan menos de 15 min? ¿Confirmar una oferta vigente está exento de RN-22? | No se generan ofertas con menos de 15 min; confirmar una oferta vigente siempre se puede mientras no venza. |
| PA-27 | **Precio por lista de espera:** el turno obtenido ¿se cobra con la tarifa de quien lo recibe (socio/no socio y pico)? | Sí. |
| PA-28 | **Reservas solapadas:** ¿puede un usuario tener dos reservas que se superponen en horario (p. ej. fútbol 19:00 y pádel 19:30)? | No. |
| PA-29 | **Pago del turno normal:** ¿el sistema registra si se pagó en el club, o solo las deudas por penalidad? | Solo deudas por penalidad. |
| PA-30 | **Canchas y precios base:** nombres y valores iniciales (RN-05). | Nombres "Fútbol 5 – Cancha 1/2", "Pádel – Cancha 1/2/3", "Tenis – Cancha 1"; precios de ejemplo en el seed, editables por el admin. |
| PA-31 | **Registro y cuentas:** campos del registro; verificación de email y recuperación de contraseña. | Nombre, apellido, teléfono, email y contraseña (sin DNI); sin verificación de email ni recuperación de contraseña en el MVP. |
| PA-32 | **Alcance del panel admin.** | (a) cambiar socio/no socio, (b) marcar asistencia/ausencia, (c) marcar deuda pagada, (d) cancelar turnos por el club, (e) ver reservas del día, (f) editar precios base. Sin reservar en nombre de otro usuario. |
| PA-33 | **Emails:** proveedor y qué correos se envían. | SMTP vía Nodemailer configurado por variables de entorno (proveedor a elegir, p. ej. Resend o Gmail SMTP) y modo "consola" en desarrollo. Correos: oferta de vacante, cancelación del club, confirmación de reserva, penalidad registrada, bloqueo. |
| PA-34 | **Identidad visual:** colores y logo del club. | Verde y blanco, sin logo. |
| PA-35 | **Entorno local:** ¿tenés Docker o Postgres instalado? | docker-compose con Postgres incluido en el repo. |

## Resueltas
| ID | Decisión | Fecha | Reflejada en |
|---|---|---|---|
| PA-01 | Grilla fija desde 08:00: fútbol cada 60 min; pádel/tenis cada 90 min | 2026-11-12 | RN-17 |
| PA-02 | Descuento y recargo, ambos sobre el precio base original | 2026-11-12 | RN-07 |
| PA-03 | Pico por hora de inicio, franja [18:00, 23:00) de lunes a viernes | 2026-11-12 | RN-06 |
| PA-04 | Sábado y domingo: pico todo el día | 2026-11-12 | RN-06 |
| PA-05 | Reservas futuras activas; el cupo se libera al pasar el turno o cancelar | 2026-11-12 | RN-03, RN-04 |
| PA-06 | Penalidad = 50% del precio final del usuario | 2026-11-12 | RN-09 |
| PA-07 | La ausencia no genera deuda; solo cuenta para el bloqueo | 2026-11-12 | RN-10, RN-11 |
| PA-08 | Registro abierto; nuevo usuario = No socio; admin cambia a Socio; ADMIN por seed | 2026-11-12 | RN-18 |
| PA-09 | Todo el sistema opera en America/Argentina/Buenos_Aires | 2026-11-12 | RN-19, `domain/tiempo.ts` |
| PA-10 | Lista de espera por turno exacto (cancha + fecha + horario) | 2026-11-12 | RN-13 |
| PA-12a | Cancelación del usuario: frontera exacta de 24 h (>= 24 h sin cargo). Cancelación del club: sin penalidad ni deuda | 2026-11-12 | RN-08, RN-09, RN-20, `domain/cancelacion.ts` |
| PA-12b | No se reserva un turno ya iniciado ni uno que empieza en menos de N minutos (valor de N en PA-22) | 2026-11-12 | RN-22, `domain/anticipacion.ts` |
| PA-13 | Ventana de ausencias: móvil de 30 días hacia atrás desde la nueva falta; la 3.ª dispara el bloqueo inmediato | 2026-11-12 | RN-12, `domain/ausencias.ts` |
| PA-14 | Importes en centavos enteros, redondeo al centavo más cercano por componente | 2026-11-12 | `domain/precio.ts` |
| PA-15 | Último turno de pádel/tenis 21:30–23:00 (margen antes del cierre) | 2026-11-12 | RN-17 |
| PA-16 | Semana lunes–domingo imputada a la fecha del turno; 2 activas por semana para socio | 2026-11-12 | RN-03, RN-04 |
| PA-17 | Anticipación en días de calendario (hoy + 7 / hoy + 3), no en horas | 2026-11-12 | RN-03, RN-04, `domain/anticipacion.ts` |
| PA-18 | Cancelación del club: turno bloqueado (no va a lista de espera), aviso por email; la "prioridad" es gestión manual del administrador | 2026-11-12 | RN-20 |
| PA-19 | Tras cumplir un bloqueo, el contador de faltas vuelve a 0 | 2026-11-12 | RN-12, `domain/ausencias.ts` |
| PA-20 | Un turno iniciado o pasado no se cancela desde el sistema (error); lo gestiona el administrador | 2026-11-12 | RN-21, `domain/cancelacion.ts` |
| PA-11 | Vencimiento de la oferta = min(ahora + 30 min, inicio del turno) | 2026-11-12 | RN-15, `domain/listaEspera.ts` |
| PA-21 | La cancelación tardía genera solo la deuda del 50%; no suma falta | 2026-11-12 | RN-09, RN-11 |
| PA-22 | Mínimo para reservar: 15 minutos | 2026-11-12 | RN-22, `domain/anticipacion.ts` |
| PA-23 | Ventana de 30 días inclusive; libre en (3.ª falta + 15); faltas durante el bloqueo se reinician con el contador | 2026-11-12 | RN-12, `domain/ausencias.ts` |
