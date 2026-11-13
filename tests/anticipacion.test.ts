import { describe, expect, it } from 'vitest';
import { dentroDeAnticipacionMaxima } from '../src/domain/anticipacion.js';
import { sumarDias } from '../src/domain/fechas.js';
import { fechaLocalClub, ZONA_HORARIA_CLUB } from '../src/domain/tiempo.js';

describe('zona horaria del club (PA-09)', () => {
  it('es America/Argentina/Buenos_Aires', () => {
    expect(ZONA_HORARIA_CLUB).toBe('America/Argentina/Buenos_Aires');
  });
  it('fechaLocalClub convierte un instante UTC a la fecha local (UTC-3)', () => {
    expect(fechaLocalClub(new Date('2026-11-13T02:30:00Z'))).toBe('2026-11-12'); // 23:30 local
    expect(fechaLocalClub(new Date('2026-11-13T03:00:00Z'))).toBe('2026-11-13'); // 00:00 local
  });
});

describe('sumarDias', () => {
  it('suma días de calendario, incluso cruzando mes y año', () => {
    expect(sumarDias('2026-11-12', 7)).toBe('2026-11-19');
    expect(sumarDias('2026-11-28', 3)).toBe('2026-12-01');
    expect(sumarDias('2026-12-30', 3)).toBe('2027-01-02');
  });
});

describe('[RN-03][RN-04] anticipación máxima en días de calendario (PA-17)', () => {
  const hoy = '2026-11-12';
  it('socio: hasta hoy + 7 días', () => {
    expect(dentroDeAnticipacionMaxima({ esSocio: true, fechaHoy: hoy, fechaNuevoTurno: '2026-11-19' })).toBe(true);
    expect(dentroDeAnticipacionMaxima({ esSocio: true, fechaHoy: hoy, fechaNuevoTurno: '2026-11-20' })).toBe(false);
  });
  it('no socio: hasta hoy + 3 días', () => {
    expect(dentroDeAnticipacionMaxima({ esSocio: false, fechaHoy: hoy, fechaNuevoTurno: '2026-11-15' })).toBe(true);
    expect(dentroDeAnticipacionMaxima({ esSocio: false, fechaHoy: hoy, fechaNuevoTurno: '2026-11-16' })).toBe(false);
  });
  it('"hoy" se toma en hora local del club, no en UTC', () => {
    const hoyLocal = fechaLocalClub(new Date('2026-11-13T02:30:00Z')); // todavía 12/11 en Buenos Aires
    expect(dentroDeAnticipacionMaxima({ esSocio: false, fechaHoy: hoyLocal, fechaNuevoTurno: '2026-11-15' })).toBe(true);
    expect(dentroDeAnticipacionMaxima({ esSocio: false, fechaHoy: hoyLocal, fechaNuevoTurno: '2026-11-16' })).toBe(false);
  });
});
