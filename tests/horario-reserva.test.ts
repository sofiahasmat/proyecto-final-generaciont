import { describe, expect, it } from 'vitest';
import { turnoReservablePorHorario } from '../src/domain/anticipacion.js';
import { instanteLocalClub } from '../src/domain/tiempo.js';

const MIN = 60 * 1000;
const inicioTurno = instanteLocalClub('2026-11-13', '18:00');

describe('[RN-22] no se reserva un turno ya iniciado ni inminente (PA-12b)', () => {
  it('rechaza turnos que ya comenzaron', () => {
    expect(turnoReservablePorHorario({ inicioTurno, ahora: new Date(+inicioTurno + MIN), minutosMinimos: 30 })).toBe(false);
    expect(turnoReservablePorHorario({ inicioTurno, ahora: new Date(+inicioTurno), minutosMinimos: 30 })).toBe(false);
  });
  it('rechaza si faltan menos minutos que el mínimo y acepta si faltan al menos esos minutos', () => {
    expect(turnoReservablePorHorario({ inicioTurno, ahora: new Date(+inicioTurno - 29 * MIN), minutosMinimos: 30 })).toBe(false);
    expect(turnoReservablePorHorario({ inicioTurno, ahora: new Date(+inicioTurno - 30 * MIN), minutosMinimos: 30 })).toBe(true);
    expect(turnoReservablePorHorario({ inicioTurno, ahora: new Date(+inicioTurno - 15 * MIN), minutosMinimos: 15 })).toBe(true);
  });
  it('aun con mínimo 0, un turno ya iniciado nunca es reservable', () => {
    expect(turnoReservablePorHorario({ inicioTurno, ahora: new Date(+inicioTurno), minutosMinimos: 0 })).toBe(false);
  });
});

describe('[RN-22] mínimo por defecto = 15 minutos (PA-22)', () => {
  it('rechaza con 14 min de margen y acepta con 15', () => {
    expect(turnoReservablePorHorario({ inicioTurno, ahora: new Date(+inicioTurno - 14 * MIN) })).toBe(false);
    expect(turnoReservablePorHorario({ inicioTurno, ahora: new Date(+inicioTurno - 15 * MIN) })).toBe(true);
  });
});
