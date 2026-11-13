import { describe, expect, it } from 'vitest';
import { estaBloqueado, registrarAusencia } from '../src/domain/ausencias.js';
import { diasEntre } from '../src/domain/fechas.js';

describe('diasEntre', () => {
  it('cuenta días de calendario entre dos fechas', () => {
    expect(diasEntre('2026-10-21', '2026-11-20')).toBe(30);
    expect(diasEntre('2026-11-20', '2026-11-20')).toBe(0);
  });
});

describe('[RN-11][RN-12] ausencias y bloqueo', () => {
  it('1.ª y 2.ª falta: no bloquean', () => {
    expect(registrarAusencia({ fechasPrevias: [], fechaNueva: '2026-11-01' })).toEqual({ ausenciasEnVentana: 1, bloquea: false });
    expect(registrarAusencia({ fechasPrevias: ['2026-11-01'], fechaNueva: '2026-11-10' })).toEqual({ ausenciasEnVentana: 2, bloquea: false });
  });

  it('3.ª falta dentro de 30 días: bloqueo inmediato por 15 días', () => {
    const r = registrarAusencia({ fechasPrevias: ['2026-11-01', '2026-11-10'], fechaNueva: '2026-11-20' });
    expect(r).toEqual({ ausenciasEnVentana: 3, bloquea: true, bloqueadoHasta: '2026-12-05' });
  });

  it('las faltas fuera de la ventana móvil de 30 días no cuentan', () => {
    const r = registrarAusencia({ fechasPrevias: ['2026-09-01', '2026-11-10'], fechaNueva: '2026-11-20' });
    expect(r).toEqual({ ausenciasEnVentana: 2, bloquea: false });
  });

  it('límite de la ventana (PA-23 provisorio): 30 días hacia atrás inclusive', () => {
    expect(registrarAusencia({ fechasPrevias: ['2026-10-21', '2026-11-10'], fechaNueva: '2026-11-20' }).bloquea).toBe(true);
    expect(registrarAusencia({ fechasPrevias: ['2026-10-20', '2026-11-10'], fechaNueva: '2026-11-20' }).bloquea).toBe(false);
  });

  it('[PA-19] al cumplirse un bloqueo el contador se reinicia: las faltas anteriores no cuentan', () => {
    const r = registrarAusencia({
      fechasPrevias: ['2026-11-01', '2026-11-05'],
      fechaNueva: '2026-11-20',
      finUltimoBloqueo: '2026-11-06',
    });
    expect(r).toEqual({ ausenciasEnVentana: 1, bloquea: false });
  });

  it('una falta registrada el mismo día del fin del bloqueo ya cuenta', () => {
    const r = registrarAusencia({ fechasPrevias: ['2026-11-06', '2026-11-08'], fechaNueva: '2026-11-10', finUltimoBloqueo: '2026-11-06' });
    expect(r.ausenciasEnVentana).toBe(3);
  });
});

describe('estaBloqueado', () => {
  it('bloqueado mientras hoy sea anterior a la fecha de fin; libre desde ese día (PA-23 provisorio)', () => {
    expect(estaBloqueado({ hoy: '2026-12-04', bloqueadoHasta: '2026-12-05' })).toBe(true);
    expect(estaBloqueado({ hoy: '2026-12-05', bloqueadoHasta: '2026-12-05' })).toBe(false);
    expect(estaBloqueado({ hoy: '2026-12-05' })).toBe(false);
  });
});
