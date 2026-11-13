import { calcularPenalidad } from './precio.js';

// RN-08 / RN-09: la frontera es exactamente 24 h antes del inicio del turno (>= 24 h: sin cargo).
// RN-16: la penalidad se cobra aunque el turno se reasigne por lista de espera (esta función no depende de eso).
const UMBRAL_SIN_CARGO_MS = 24 * 60 * 60 * 1000;

export interface EntradaCancelacion {
  inicioTurno: Date; // instante UTC del inicio (ver instanteLocalClub)
  ahora: Date;
  precioFinalCentavos: number; // lo que le correspondía pagar al usuario (RN-07)
}

export interface ResultadoCancelacion {
  tardia: boolean;
  penalidadCentavos: number;
  generaDeuda: boolean;
}

export function evaluarCancelacionPorUsuario({ inicioTurno, ahora, precioFinalCentavos }: EntradaCancelacion): ResultadoCancelacion {
  const anticipacionMs = inicioTurno.getTime() - ahora.getTime();
  if (anticipacionMs <= 0) {
    throw new RangeError('No se puede cancelar un turno que ya comenzó (PA-20, pendiente de definición)');
  }
  if (anticipacionMs >= UMBRAL_SIN_CARGO_MS) {
    return { tardia: false, penalidadCentavos: 0, generaDeuda: false };
  }
  const penalidadCentavos = calcularPenalidad(precioFinalCentavos);
  return { tardia: true, penalidadCentavos, generaDeuda: penalidadCentavos > 0 };
}

// PA-12: si el club cancela (mantenimiento o fuerza mayor) no hay penalidad ni deuda.
export function evaluarCancelacionPorClub(): ResultadoCancelacion {
  return { tardia: false, penalidadCentavos: 0, generaDeuda: false };
}
