import { describe, expect, it } from 'vitest';
import { ofertaVigente, primerUsuarioApto, venceOferta, type CandidatoCola } from '../src/domain/listaEspera.js';
import { instanteLocalClub } from '../src/domain/tiempo.js';

const MIN = 60 * 1000;
const inicioTurno = instanteLocalClub('2026-11-13', '18:00');

describe('[RN-15] vencimiento de la oferta = min(ahora + 30 min, inicio del turno) (PA-11)', () => {
  it('con tiempo de sobra vence a los 30 minutos', () => {
    const ahora = new Date(+inicioTurno - 3 * 60 * MIN);
    expect(venceOferta({ ahora, inicioTurno }).getTime()).toBe(+ahora + 30 * MIN);
  });
  it('si faltan menos de 30 min vence al comenzar el turno', () => {
    const ahora = new Date(+inicioTurno - 20 * MIN);
    expect(venceOferta({ ahora, inicioTurno }).getTime()).toBe(+inicioTurno);
  });
  it('faltando exactamente 30 min vence al comenzar el turno', () => {
    const ahora = new Date(+inicioTurno - 30 * MIN);
    expect(venceOferta({ ahora, inicioTurno }).getTime()).toBe(+inicioTurno);
  });
});

describe('[RN-15] vigencia de la oferta', () => {
  const venceEn = new Date(+inicioTurno - 60 * MIN);
  it('vigente antes del vencimiento; vencida en el instante del vencimiento y después', () => {
    expect(ofertaVigente({ venceEn, ahora: new Date(+venceEn - 1) })).toBe(true);
    expect(ofertaVigente({ venceEn, ahora: new Date(+venceEn) })).toBe(false);
    expect(ofertaVigente({ venceEn, ahora: new Date(+venceEn + MIN) })).toBe(false);
  });
});

describe('[RN-14] primer usuario apto de la cola', () => {
  const base = { esSocio: false, bloqueado: false, tieneDeudaPendiente: false, fechasActivas: [] as string[] };
  const t = (min: number) => new Date(+inicioTurno - 48 * 60 * MIN + min * MIN);
  const fechaTurno = '2026-11-13';

  it('respeta el orden de anotación y saltea bloqueados, con deuda o sin cupo semanal', () => {
    const cola: CandidatoCola[] = [
      { ...base, usuarioId: 'u5', anotadoEn: t(50) },
      { ...base, usuarioId: 'u1', anotadoEn: t(1), bloqueado: true },
      { ...base, usuarioId: 'u2', anotadoEn: t(2), tieneDeudaPendiente: true },
      { ...base, usuarioId: 'u3', anotadoEn: t(3), esSocio: true, fechasActivas: ['2026-11-12', '2026-11-14'] }, // 2 en la semana
      { ...base, usuarioId: 'u4', anotadoEn: t(4) },
    ];
    expect(primerUsuarioApto(cola, fechaTurno)?.usuarioId).toBe('u4');
  });

  it('el cupo se mide en la semana del turno: reservas de otra semana no cuentan', () => {
    const cola: CandidatoCola[] = [{ ...base, usuarioId: 'u1', anotadoEn: t(1), fechasActivas: ['2026-11-20'] }];
    expect(primerUsuarioApto(cola, fechaTurno)?.usuarioId).toBe('u1');
  });

  it('devuelve undefined si nadie es apto o la cola está vacía', () => {
    expect(primerUsuarioApto([], fechaTurno)).toBe(undefined);
    expect(primerUsuarioApto([{ ...base, usuarioId: 'u1', anotadoEn: t(1), bloqueado: true }], fechaTurno)).toBe(undefined);
  });
});
