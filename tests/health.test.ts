import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { HORARIO_CLUB, INVENTARIO } from '../src/domain/canchas.js';

describe('API base', () => {
  it('GET /api/health responde ok', async () => {
    const res = await request(createApp()).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('[RN-01][RN-02] inventario', () => {
  it('coincide con la especificación', () => {
    expect(INVENTARIO.FUTBOL_5).toEqual({ canchas: 2, duracionMin: 60 });
    expect(INVENTARIO.PADEL).toEqual({ canchas: 3, duracionMin: 90 });
    expect(INVENTARIO.TENIS).toEqual({ canchas: 1, duracionMin: 90 });
    expect(HORARIO_CLUB).toEqual({ apertura: '08:00', cierre: '00:00' });
  });
});
