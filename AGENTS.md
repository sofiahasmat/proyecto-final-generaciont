# AGENTS.md — Gobernanza del proyecto ReservaClub

## Principios
1. **La especificación es la ley.** La fuente de verdad es `docs/spec.md`. Si una regla de negocio no está especificada, **no se inventa**: se frena y se registra la duda en `docs/preguntas-abiertas.md` para consultarla.
2. **Todo cambio entra por la spec.** Orden obligatorio:
   1. Modificar `docs/spec.md` (y `docs/glossary.md` si hay términos nuevos).
   2. Crear/actualizar tareas técnicas en `docs/tareas.md`.
   3. Escribir tests que fallan (**Test Rojo**).
   4. Implementar lo mínimo para que pasen (**Test Verde**).
   5. Refactorizar sin romper tests.
3. **Trazabilidad.** Cada commit referencia una regla de negocio (`RN-xx`) o historia de usuario (`HU-xx`). Formato: `feat(reservas): [RN-08] cancelación sin cargo >= 24 h`.
4. **Capas estrictas en el backend:** `routes -> controllers -> services -> repositories`. Los controllers no acceden a repositories; los repositories no contienen reglas de negocio. Las reglas puras viven en `domain/`.

## Roles
| Rol | Responsabilidad | Puede tocar |
|---|---|---|
| **Analista** | Mantiene `docs/spec.md` y `docs/glossary.md` | `docs/spec.md`, `docs/glossary.md`, `docs/preguntas-abiertas.md` |
| **Arquitecto** | Plan técnico, modelo de datos, contratos de API | `docs/plan-tecnico.md`, `docs/api.md`, migraciones |
| **Dev Backend** | Controller / Service / Repository | `backend/` |
| **Dev Frontend** | UI React + TS | `frontend/` |
| **Tester & Revisor** | Verifica tests, aprueba PRs antes del deploy | Tests, revisión de PRs |

## Definición de "hecho"
- Existe regla/HU en la spec que lo respalda.
- Tests escritos primero y en verde.
- CI en verde (lint/typecheck/test/build).
- PR aprobado por el Tester & Revisor.
- Merge a `main` => despliegue automático (Render backend, Netlify frontend).
