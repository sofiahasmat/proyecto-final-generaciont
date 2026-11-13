import { describe, expect, it } from 'vitest';
import { calcularPenalidad, calcularPrecioFinal } from '../src/domain/precio.js';

const BASE = 100_000; // $1000 en centavos

describe('[RN-07] precio final', () => {
  it('no socio, no pico: precio base', () => {
    expect(calcularPrecioFinal({ precioBaseCentavos: BASE, esSocio: false, esPico: false })).toBe(100_000);
  });
  it('socio, no pico: -20% de la base', () => {
    expect(calcularPrecioFinal({ precioBaseCentavos: BASE, esSocio: true, esPico: false })).toBe(80_000);
  });
  it('socio, pico: base - 20% + 30% de la base', () => {
    expect(calcularPrecioFinal({ precioBaseCentavos: BASE, esSocio: true, esPico: true })).toBe(110_000);
  });
  it('no socio, pico: base + 30%', () => {
    expect(calcularPrecioFinal({ precioBaseCentavos: BASE, esSocio: false, esPico: true })).toBe(130_000);
  });
  it('siempre devuelve centavos enteros', () => {
    const r = calcularPrecioFinal({ precioBaseCentavos: 333, esSocio: true, esPico: true });
    expect(Number.isInteger(r)).toBe(true);
  });
  it('rechaza precios base inválidos', () => {
    expect(() => calcularPrecioFinal({ precioBaseCentavos: -1, esSocio: false, esPico: false })).toThrow();
    expect(() => calcularPrecioFinal({ precioBaseCentavos: 10.5, esSocio: false, esPico: false })).toThrow();
  });
});

describe('[RN-09] penalidad por cancelación tardía', () => {
  it('es el 50% del precio final del usuario', () => {
    expect(calcularPenalidad(110_000)).toBe(55_000);
    expect(calcularPenalidad(80_000)).toBe(40_000);
  });
});
