# Especificación — ReservaClub (v0.7)

> Fuente de verdad. Lo que no esté acá, no se implementa: se pregunta (ver `preguntas-abiertas.md`).
> v0.2: decisiones PA-01, PA-02, PA-05, PA-06, PA-08, PA-10. v0.3: decisiones PA-03, PA-04, PA-14, PA-15, PA-16. v0.4: decisiones PA-09 y PA-17. v0.5: decisiones PA-07, PA-12 (cancelaciones), PA-13. v0.6: decisiones PA-12b, PA-18, PA-19, PA-20. v0.7: decisiones PA-11, PA-21, PA-22, PA-23.

## Contexto
El club gestiona reservas por WhatsApp: caos, turnos duplicados y ausencias sin aviso. Se necesita un sistema web automatizado con reglas estrictas para socios y no socios.

## Reglas de negocio

### Canchas e inventario
- **RN-01** Fútbol 5: 2 canchas, turno de 60 min. Pádel: 3 canchas, turno de 90 min. Tenis: 1 cancha, turno de 90 min.
- **RN-02** El club abre todos los días de 8:00 a 00:00 h, sin excepción.
- **RN-19 Zona horaria** (PA-09): todo el sistema opera en `America/Argentina/Buenos_Aires` para turnos, aperturas, cierres y validaciones de tiempo (anticipación, ventana de 24 h, horario pico, ofertas de 30 min).
- **RN-17 Grilla de turnos** (decisión PA-01): los turnos son bloques fijos que empiezan a las 8:00 y se encadenan sin huecos.
  - Fútbol 5 (60 min): 08:00, 09:00, …, 23:00 (el último termina 00:00). 16 turnos por cancha y día.
  - Pádel y Tenis (90 min): 08:00–09:30, 09:30–11:00, 11:00–12:30, 12:30–14:00, 14:00–15:30, 15:30–17:00, 17:00–18:30, 18:30–20:00, 20:00–21:30, 21:30–23:00. 10 turnos por cancha y día. El último turno termina a las 23:00 a propósito (PA-15): se deja margen antes del cierre del club.

### Usuarios
- **RN-03 Socios:** reservan con hasta 7 días de calendario de anticipación (hasta la fecha de hoy + 7, PA-17); máximo 2 reservas activas por semana calendario (decisiones PA-05 y PA-16); 20% de descuento sobre el precio base.
- **RN-04 No socios:** hasta 3 días de calendario de anticipación (hasta la fecha de hoy + 3, PA-17); máximo 1 reserva activa por semana calendario; precio estándar sin descuento.
- **Reserva activa** (decisión PA-05): reserva futura no cancelada. Cuando el turno transcurre o se cancela, el cupo se libera. La **semana calendario** va de lunes a domingo y se imputa a la fecha en que se juega el turno, no a la fecha en que se reserva (PA-16). Un socio puede así tener hasta 2 activas en cada semana (p. ej. 4 en total con 7 días de anticipación).
- **RN-18 Alta y roles** (decisión PA-08): el registro es abierto con email, contraseña y datos personales. Todo usuario nuevo entra como **No socio**. El administrador cambia manualmente a **Socio** desde su panel. Existe un rol `ADMIN`, creado por *seed* en la base de datos (las credenciales iniciales no se versionan: se leen de variables de entorno).

### Precios
- **RN-05** Cada cancha tiene un precio base guardado en el sistema.
- **RN-06** Horario pico: +30% **del precio base**. Un turno es pico si (PA-03, PA-04):
  - cae en **sábado o domingo**, en cualquier horario de apertura; o
  - de lunes a viernes, su **hora de inicio** está en [18:00, 23:00) (inicio estrictamente evaluado: el turno de pádel/tenis 17:00–18:30 y el de fútbol 23:00–00:00 llevan tarifa normal).
- **RN-07** (decisión PA-02) Descuento de socio y recargo pico se calculan ambos sobre el precio base original:
  `Precio final = Base − (20% de Base si es socio) + (30% de Base si es pico)`.
  Ejemplo con base $1000: socio no pico = $800; socio pico = $1100; no socio pico = $1300; no socio no pico = $1000.

### Cancelaciones, deudas y ausencias
- **RN-08** Cancelación con >= 24 h de anticipación al horario de inicio del turno (frontera exacta: 24 h cuenta como sin cargo): sin cargo; el turno se libera de inmediato.
- **RN-09** Cancelación con < 24 h: penalidad del 50% del **precio final** del turno que le correspondía pagar al usuario, con su tarifa de socio y/o recargo pico (decisión PA-06). La cancelación tardía genera solo la deuda: no suma falta (PA-21).
- **RN-10** (la única fuente de deuda es la penalidad por cancelación tardía, PA-07) El sistema no procesa pagos online: registra una **deuda** que se abona en el club. Con deuda no se pueden hacer nuevas reservas hasta que el administrador la marque como pagada.
- **RN-11** Ausencia: llegar > 15 min tarde o no presentarse; la marca el administrador. La ausencia **no genera deuda** por sí misma (PA-07): solo acumula faltas. La falta se reserva para quien no cancela y no se presenta, o llega > 15 min tarde (PA-21).
- **RN-12** 3 ausencias en 30 días => usuario bloqueado 15 días. Los 30 días son una **ventana móvil hacia atrás** desde la fecha de la nueva falta registrada: si con esa falta suma 3 en los últimos 30 días, el bloqueo es inmediato (PA-13). Al cumplirse los 15 días el contador de faltas se reinicia en 0: las faltas anteriores ya no cuentan (PA-19). La ventana incluye el día 30 hacia atrás; el usuario queda libre el día (fecha de la 3.ª falta + 15) y conserva las reservas vigentes que ya tenía; las faltas registradas durante el bloqueo también se reinician (PA-23). El bloqueado no puede crear reservas nuevas pero conserva las vigentes.

- **RN-20 Cancelación por el club** (mantenimiento o fuerza mayor, PA-12 y PA-18): no genera penalidad ni deuda al usuario. El turno queda **bloqueado** (la cancha no está disponible): no se ofrece a la lista de espera ni se generan turnos nuevos. El sistema notifica al afectado por email. La "prioridad" para el afectado es una gestión administrativa manual, fuera de la lista de espera (voucher, descuento o contacto directo para reubicarlo en otra cancha u horario).
- **RN-21 Turnos iniciados** (PA-20): un turno que ya comenzó o ya pasó no se puede cancelar desde el sistema. Interviene solo el administrador, que marca asistencia o ausencia (RN-11).
- **RN-22 Reserva de último momento** (PA-12b): no se pueden crear reservas para turnos ya iniciados ni para turnos que empiezan en menos de 15 minutos (PA-22).

### Lista de espera y notificaciones
- **RN-13** (decisión PA-10) Si un turno está ocupado, cualquier usuario puede anotarse en la lista de espera **de ese turno exacto** (cancha específica + fecha + horario). No cuenta para el límite de reservas.
- **RN-14** Al cancelarse un turno, se asigna automáticamente al primer usuario apto de la cola de ese turno (no bloqueado, sin deuda y con cupo esa semana).
- **RN-15** Se notifica por email; el usuario tiene 30 min para confirmar o rechazar; el vencimiento es el menor entre ahora + 30 min y el inicio del turno, así que si faltan menos de 30 min la oferta caduca al comenzar el turno (PA-11). Si rechaza o vence el plazo, se descarta su opción sin penalidad y pasa automáticamente al siguiente de la cola.
- **RN-16** Si el turno se canceló tarde y se reasigna por lista de espera, igual se cobra el 50% de penalidad a quien canceló tarde.

## Historias de usuario (borrador — a validar por el Analista)
- **HU-01** Como usuario quiero ver la disponibilidad por deporte y fecha. (RN-01, RN-02, RN-17)
- **HU-02** Como usuario quiero reservar un turno y ver su precio final. (RN-03..RN-07)
- **HU-03** Como usuario quiero cancelar una reserva y saber si hay penalidad. (RN-08, RN-09)
- **HU-04** Como usuario quiero anotarme en lista de espera. (RN-13..RN-16)
- **HU-05** Como administrador quiero marcar ausencias y deudas pagadas, y cambiar usuarios a socio. (RN-10..RN-12, RN-18)
- **HU-06** Como visitante quiero registrarme e iniciar sesión. (RN-18)
