import { tieneCupoSemanal } from './semana.js';

// RN-13..RN-15 (PA-10, PA-11). Lista de espera por turno exacto (cancha + fecha + horario).
export const MINUTOS_VIGENCIA_OFERTA = 30;

/** PA-11: la oferta vence a los 30 min o al comenzar el turno, lo que ocurra primero. */
export function venceOferta({ ahora, inicioTurno }: { ahora: Date; inicioTurno: Date }): Date {
  const aLosTreintaMin = ahora.getTime() + MINUTOS_VIGENCIA_OFERTA * 60_000;
  return new Date(Math.min(aLosTreintaMin, inicioTurno.getTime()));
}

/** Vigente mientras ahora < venceEn (en el instante exacto del vencimiento ya no se puede confirmar). */
export function ofertaVigente({ venceEn, ahora }: { venceEn: Date; ahora: Date }): boolean {
  return ahora.getTime() < venceEn.getTime();
}

export interface CandidatoCola {
  usuarioId: string;
  anotadoEn: Date;
  esSocio: boolean;
  bloqueado: boolean;
  tieneDeudaPendiente: boolean;
  /** Fechas de turno de sus reservas activas (para el cupo semanal). */
  fechasActivas: string[];
}

/** RN-14: primer usuario apto por orden de anotación: sin bloqueo, sin deuda y con cupo en la semana del turno. */
export function primerUsuarioApto(cola: CandidatoCola[], fechaTurno: string): CandidatoCola | undefined {
  return [...cola]
    .sort((a, b) => a.anotadoEn.getTime() - b.anotadoEn.getTime())
    .find(
      (c) =>
        !c.bloqueado &&
        !c.tieneDeudaPendiente &&
        tieneCupoSemanal({ esSocio: c.esSocio, fechasActivas: c.fechasActivas, fechaNuevoTurno: fechaTurno }),
    );
}
