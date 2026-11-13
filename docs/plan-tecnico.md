# Plan técnico (Arquitecto) — propuesta v0.1

## Decisión de base de datos (ADR-001): PostgreSQL
- **Concurrencia / turnos duplicados:** restricción de exclusión (`EXCLUDE USING gist`) sobre `(cancha_id, tstzrange(inicio, fin))` para reservas activas: la propia BD impide el doble booking.
- Transacciones para asignar vacantes de lista de espera y evitar carreras.
- Disponible como servicio administrado en Render.
- Acceso desde el Repository con `pg` (o Prisma/Kysely, a decidir).

## Capas del backend
`routes -> controllers (HTTP, validación) -> services (casos de uso, reglas) -> repositories (SQL)`; reglas puras (precio, ventanas horarias, bloqueo) en `domain/`, testeables sin BD.

## Entidades (borrador)
usuarios, canchas, reservas, lista_espera, ofertas_vacante, deudas, ausencias, notificaciones.

## Jobs
- Vencimiento de ofertas de 30 min.
- Desbloqueo a los 15 días.

## Pendiente de resolver antes del esquema
Ver `preguntas-abiertas.md` (PA-01, PA-05, PA-08, PA-10).

## Decisiones técnicas adicionales (Arquitecto)
- **ADR-002 Acceso a datos:** `pg` con migraciones SQL versionadas, sin ORM. Necesitamos SQL propio para la restricción de exclusión de turnos y para transacciones con bloqueo de filas.
- **ADR-003 Autenticación:** JWT en el header `Authorization: Bearer` (frontend y backend están en dominios distintos: Netlify y Render) y contraseñas con bcrypt.
- **ADR-004 Vencimiento de ofertas:** evaluación perezosa en cada lectura/escritura (una oferta vencida se trata como vencida aunque el job no haya corrido) más un job periódico cada minuto. El plan gratuito de Render duerme el servicio, así que no se puede depender solo del job.
- **ADR-005 Tests de repositorios:** contra un Postgres real (service container en GitHub Actions y docker-compose en local). No se simula la BD porque la restricción de exclusión no es reproducible con mocks.
