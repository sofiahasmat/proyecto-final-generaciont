import { describe, expect, it } from 'vitest';
import { evaluarCancelacionPorClub, evaluarCancelacionPorUsuario } from '../src/domain/cancelacion.js';
import { tieneDeudaPendiente } from '../src/domain/deudas.js';
import { instanteLocalClub } from '../src/domain/tiempo.js';

const HORA = 60 * 60 * 1000;
const MIN = 60 * 1000;
const inicioTurno = instanteLocalClub('2026-11-13', '18:00');
const PRECIO_FINAL = 110_000; // socio en horario pico, base $1000

describe('[RN-08][RN-09] cancelación por el usuario (frontera exacta de 24 h)', () => {
  it('con más de 24 h de anticipación: sin cargo', () => {
    const r = evaluarCancelacionPorUsuario({ inicioTurno, ahora: new Date(+inicioTurno - 30 * HORA), precioFinalCentavos: PRECIO_FINAL });
    expect(r).toEqual({ tardia: false, penalidadCentavos: 0, generaDeuda: false });
  });
  it('exactamente 24 h antes: sin cargo (>= 24 h)', () => {
    const r = evaluarCancelacionPorUsuario({ inicioTurno, ahora: new Date(+inicioTurno - 24 * HORA), precioFinalCentavos: PRECIO_FINAL });
    expect(r.tardia).toBe(false);
    expect(r.penalidadCentavos).toBe(0);
  });
  it('1 minuto menos de 24 h: tardía, penalidad del 50% del precio final y genera deuda', () => {
    const r = evaluarCancelacionPorUsuario({ inicioTurno, ahora: new Date(+inicioTurno - 24 * HORA + MIN), precioFinalCentavos: PRECIO_FINAL });
    expect(r).toEqual({ tardia: true, penalidadCentavos: 55_000, generaDeuda: true });
  });
  it('la penalidad usa el precio final del usuario (socio no pico = $800 -> $400)', () => {
    const r = evaluarCancelacionPorUsuario({ inicioTurno, ahora: new Date(+inicioTurno - 2 * HORA), precioFinalCentavos: 80_000 });
    expect(r.penalidadCentavos).toBe(40_000);
  });
  it('un turno ya iniciado no se puede cancelar (PA-20, provisorio)', () => {
    expect(() => evaluarCancelacionPorUsuario({ inicioTurno, ahora: new Date(+inicioTurno), precioFinalCentavos: PRECIO_FINAL })).toThrow();
  });
});

describe('cancelación por el club (PA-12)', () => {
  it('nunca genera penalidad ni deuda', () => {
    expect(evaluarCancelacionPorClub()).toEqual({ tardia: false, penalidadCentavos: 0, generaDeuda: false });
  });
});

describe('[RN-10] deuda pendiente bloquea nuevas reservas', () => {
  it('con alguna deuda PENDIENTE hay deuda', () => {
    expect(tieneDeudaPendiente([{ montoCentavos: 55_000, estado: 'PENDIENTE' }])).toBe(true);
    expect(tieneDeudaPendiente([{ montoCentavos: 1, estado: 'PAGADA' }, { montoCentavos: 2, estado: 'PENDIENTE' }])).toBe(true);
  });
  it('sin deudas o con todas PAGADAS no hay deuda', () => {
    expect(tieneDeudaPendiente([])).toBe(false);
    expect(tieneDeudaPendiente([{ montoCentavos: 55_000, estado: 'PAGADA' }])).toBe(false);
  });
});
