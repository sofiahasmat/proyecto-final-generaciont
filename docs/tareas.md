# Tareas técnicas

- [x] T-00 Resolver preguntas abiertas críticas (PA-01, PA-02, PA-05, PA-06, PA-08, PA-10)
- [x] T-01 [RN-01, RN-02, RN-17] Dominio: grilla de turnos (`domain/grilla.ts`)
- [x] T-02 [RN-05..RN-07, RN-09] Calculadora de precio y penalidad (`domain/precio.ts`). La decisión "¿es pico?" queda fuera hasta resolver PA-03/PA-04; la función recibe `esPico` como dato.
- [x] T-02b [RN-06] Determinar horario pico (`domain/pico.ts`)
- [x] T-03a [RN-03, RN-04] Cupo de reservas activas por semana (`domain/semana.ts`)
- [x] T-03b [RN-03, RN-04, RN-19] Anticipación máxima 7 / 3 días de calendario (`domain/anticipacion.ts`, `domain/tiempo.ts`)
- [x] T-04a [RN-08, RN-09, RN-10, RN-20] Cancelación por usuario (frontera 24 h), por el club (sin cargo) y deuda pendiente (`domain/cancelacion.ts`, `domain/deudas.ts`)
- [ ] T-04b [RN-20] Bloqueo del turno y notificación por email ante cancelación del club (requiere BD y servicio de email)
- [x] T-03c [RN-22] Reserva de último momento (`turnoReservablePorHorario`, N = 15 min, PA-22)
- [x] T-05 [RN-11, RN-12] Ausencias y bloqueo, ventana móvil y reinicio de contador (`domain/ausencias.ts`)
- [x] T-06a [RN-14, RN-15] Dominio de lista de espera: primer apto y vencimiento de oferta (`domain/listaEspera.ts`)
- [ ] T-06b [RN-13..RN-16] Cola, retención del turno, ofertas y emails (requiere BD; ver PA-24..PA-26, PA-33)
- [ ] T-07 [RN-18] Registro, login y rol ADMIN (seed por variables de entorno)
- [ ] T-08 Esquema de BD y repositories (PostgreSQL, ADR-001)
- [ ] T-09 Frontend: disponibilidad, reserva, mis reservas, panel admin
