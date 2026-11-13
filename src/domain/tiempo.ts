import { parseFecha, parseHoraEnMinutos } from './fechas.js';

// PA-09: todo el sistema opera en la zona horaria del club (turnos, apertura/cierre, validaciones).
export const ZONA_HORARIA_CLUB = 'America/Argentina/Buenos_Aires';

/** Fecha local del club ('YYYY-MM-DD') correspondiente a un instante. */
export function fechaLocalClub(instante: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: ZONA_HORARIA_CLUB,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(instante);
}

function desfaseMinutos(instante: Date): number {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: ZONA_HORARIA_CLUB,
    hourCycle: 'h23',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).formatToParts(instante);
  const v = (tipo: string) => Number(partes.find((p) => p.type === tipo)!.value);
  const comoUTC = Date.UTC(v('year'), v('month') - 1, v('day'), v('hour'), v('minute'), v('second'));
  return Math.round((comoUTC - instante.getTime()) / 60000);
}

/** Instante UTC que corresponde a una fecha ('YYYY-MM-DD') y hora ('HH:MM') locales del club. */
export function instanteLocalClub(fecha: string, hhmm: string): Date {
  const { y, m, d } = parseFecha(fecha);
  const referencia = Date.UTC(y, m - 1, d, 0, parseHoraEnMinutos(hhmm));
  return new Date(referencia - desfaseMinutos(new Date(referencia)) * 60000);
}
