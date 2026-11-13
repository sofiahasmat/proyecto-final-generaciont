import { describe, expect, it } from 'vitest';
import { inicioDeSemana, tieneCupoSemanal } from '../src/domain/semana.js';

describe('semana calendario lunes–domingo (PA-16)', () => {
  it('devuelve el lunes de la semana de la fecha del turno', () => {
    expect(inicioDeSemana('2026-11-09')).toBe('2026-11-09'); // lunes
    expect(inicioDeSemana('2026-11-12')).toBe('2026-11-09'); // jueves
    expect(inicioDeSemana('2026-11-15')).toBe('2026-11-09'); // domingo
    expect(inicioDeSemana('2026-11-16')).toBe('2026-11-16'); // lunes siguiente
  });
});

describe('[RN-03][RN-04] límite de reservas activas por semana', () => {
  it('socio: máximo 2 en la misma semana', () => {
    expect(tieneCupoSemanal({ esSocio: true, fechasActivas: [], fechaNuevoTurno: '2026-11-12' })).toBe(true);
    expect(tieneCupoSemanal({ esSocio: true, fechasActivas: ['2026-11-12'], fechaNuevoTurno: '2026-11-13' })).toBe(true);
    expect(
      tieneCupoSemanal({ esSocio: true, fechasActivas: ['2026-11-12', '2026-11-13'], fechaNuevoTurno: '2026-11-15' }),
    ).toBe(false);
  });

  it('no socio: máximo 1 en la misma semana', () => {
    expect(tieneCupoSemanal({ esSocio: false, fechasActivas: ['2026-11-12'], fechaNuevoTurno: '2026-11-14' })).toBe(false);
  });

  it('el cupo se cuenta por la semana en que se juega, no por la semana en que se reserva', () => {
    // 2 activas esta semana no impiden reservar para la semana siguiente
    expect(
      tieneCupoSemanal({ esSocio: true, fechasActivas: ['2026-11-12', '2026-11-13'], fechaNuevoTurno: '2026-11-16' }),
    ).toBe(true);
    expect(tieneCupoSemanal({ esSocio: false, fechasActivas: ['2026-11-12'], fechaNuevoTurno: '2026-11-16' })).toBe(true);
  });
});
