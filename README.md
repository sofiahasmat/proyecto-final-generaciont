# ReservaClub — Club Atlético Villa Norte

Sistema web de reservas de canchas (Fútbol 5, Pádel, Tenis) con reglas para socios y no socios.

## Estructura
- `docs/` — especificación, glosario, plan técnico, preguntas abiertas, tareas
- `backend/` — Node + Express + TypeScript (Controller / Service / Repository)
- `frontend/` — React + TypeScript (Vite)
- `AGENTS.md` — normas de trabajo y roles

## Puesta en marcha
```bash
cd backend && cp .env.example .env && npm install && npm test && npm run dev
cd frontend && npm install && npm run dev
```

## Despliegue
- Backend: Render (`render.yaml`)
- Frontend: Netlify (`frontend/netlify.toml`)
- Push a `main` => despliegue automático, una vez aprobado el PR.
