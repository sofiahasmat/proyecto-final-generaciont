import { describe, expect, it } from 'vitest';
import { esInicioValido, generarGrilla } from '../src/domain/grilla.js';

describe('[RN-17] grilla de turnos', () => {
  it('Pádel y Tenis: bloques de 90 min desde las 08:00, el último termina 23:00', () => {
    const esperado = [
      ['08:00', '09:30'], ['09:30', '11:00'], ['11:00', '12:30'], ['12:30', '14:00'],
      ['14:00', '15:30'], ['15:30', '17:00'], ['17:00', '18:30'], ['18:30', '20:00'],
      ['20:00', '21:30'], ['21:30', '23:00'],
    ];
    for (const deporte of ['PADEL', 'TENIS'] as const) {
      expect(generarGrilla(deporte).map((t) => [t.inicio, t.fin])).toEqual(esperado);
    }
  });

  it('Fútbol 5: 16 bloques de 60 min, de 08:00 a 00:00', () => {
    const g = generarGrilla('FUTBOL_5');
    expect(g).toHaveLength(16);
    expect([g[0].inicio, g[0].fin]).toEqual(['08:00', '09:00']);
    expect([g[15].inicio, g[15].fin]).toEqual(['23:00', '00:00']);
  });

  it('[RN-02] ningún turno excede el cierre del club y no hay huecos entre turnos', () => {
    for (const deporte of ['FUTBOL_5', 'PADEL', 'TENIS'] as const) {
      const g = generarGrilla(deporte);
      expect(g.every((t) => t.finMin <= 24 * 60)).toBe(true);
      for (let i = 1; i < g.length; i++) expect(g[i].inicioMin).toBe(g[i - 1].finMin);
    }
  });

  it('valida que un horario de inicio pertenezca a la grilla del deporte', () => {
    expect(esInicioValido('PADEL', '09:30')).toBe(true);
    expect(esInicioValido('PADEL', '09:00')).toBe(false);
    expect(esInicioValido('FUTBOL_5', '09:00')).toBe(true);
    expect(esInicioValido('FUTBOL_5', '23:30')).toBe(false);
  });
});
