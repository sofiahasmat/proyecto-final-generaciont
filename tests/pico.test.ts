import { describe, expect, it } from 'vitest';
import { esHorarioPico } from '../src/domain/pico.js';

// 2026-11-12 jueves · 2026-11-14 sábado · 2026-11-15 domingo · 2026-11-16 lunes
describe('[RN-06] horario pico', () => {
  it('lun–vie: se evalúa estrictamente por la hora de inicio, franja [18:00, 23:00)', () => {
    expect(esHorarioPico('2026-11-12', '08:00')).toBe(false);
    expect(esHorarioPico('2026-11-12', '17:00')).toBe(false); // pádel 17:00–18:30 -> tarifa normal
    expect(esHorarioPico('2026-11-12', '17:59')).toBe(false);
    expect(esHorarioPico('2026-11-12', '18:00')).toBe(true);
    expect(esHorarioPico('2026-11-12', '18:30')).toBe(true);
    expect(esHorarioPico('2026-11-12', '21:30')).toBe(true);
    expect(esHorarioPico('2026-11-12', '22:00')).toBe(true);
    expect(esHorarioPico('2026-11-12', '23:00')).toBe(false); // fútbol 23:00–00:00 -> tarifa normal
  });

  it('sábado y domingo: pico todo el día', () => {
    for (const fecha of ['2026-11-14', '2026-11-15']) {
      expect(esHorarioPico(fecha, '08:00')).toBe(true);
      expect(esHorarioPico(fecha, '12:30')).toBe(true);
      expect(esHorarioPico(fecha, '23:00')).toBe(true);
    }
  });

  it('lunes no es fin de semana', () => {
    expect(esHorarioPico('2026-11-16', '10:00')).toBe(false);
  });

  it('rechaza fecha u hora con formato inválido', () => {
    expect(() => esHorarioPico('12/11/2026', '10:00')).toThrow();
    expect(() => esHorarioPico('2026-11-12', '25:00')).toThrow();
  });
});
