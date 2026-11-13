import { parseFecha, sumarDias } from './fechas.js';

// RN-03 / RN-04 (decisión PA-17): la anticipación máxima se mide en días de calendario
// (hasta la fecha de hoy + N), en hora local del club. No son 168 / 72 horas.
// Nota: no decide sobre turnos pasados ni anticipación mínima (PA-12, abierta).
export const ANTICIPACION_MAXIMA_DIAS = { socio: 7, noSocio: 3 } as const;

export interface EntradaAnticipacion {
  esSocio: boolean;
  fechaHoy: string; // 'YYYY-MM-DD' en hora local del club (ver fechaLocalClub)
  fechaNuevoTurno: string; // 'YYYY-MM-DD'
}

export function dentroDeAnticipacionMaxima({ esSocio, fechaHoy, fechaNuevoTurno }: EntradaAnticipacion): boolean {
  parseFecha(fechaNuevoTurno);
  const dias = esSocio ? ANTICIPACION_MAXIMA_DIAS.socio : ANTICIPACION_MAXIMA_DIAS.noSocio;
  return fechaNuevoTurno <= sumarDias(fechaHoy, dias); // fechas ISO: la comparación de texto respeta el orden
}

// RN-22 (PA-12b): no se reserva un turno ya iniciado ni uno que empieza en menos de N minutos.
// N = 15 minutos (PA-22).
export const MINUTOS_MINIMOS_PARA_RESERVAR = 15;
export interface EntradaHorarioReserva {
  inicioTurno: Date;
  ahora: Date;
  minutosMinimos?: number;
}

export function turnoReservablePorHorario({
  inicioTurno,
  ahora,
  minutosMinimos = MINUTOS_MINIMOS_PARA_RESERVAR,
}: EntradaHorarioReserva): boolean {
  const faltanMs = inicioTurno.getTime() - ahora.getTime();
  return faltanMs > 0 && faltanMs >= minutosMinimos * 60_000;
}
