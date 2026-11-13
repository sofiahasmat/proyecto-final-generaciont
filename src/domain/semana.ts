import { diaDeSemana, parseFecha } from './fechas.js';

// RN-03 / RN-04 (decisiones PA-05 y PA-16): el cupo se cuenta por semana calendario
// lunes–domingo, imputada a la fecha en que se juega el turno.
export const LIMITE_RESERVAS_POR_SEMANA = { socio: 2, noSocio: 1 } as const;

/** Devuelve el lunes ('YYYY-MM-DD') de la semana de la fecha dada. */
export function inicioDeSemana(fecha: string): string {
  const { y, m, d } = parseFecha(fecha);
  const retroceso = (diaDeSemana(fecha) + 6) % 7; // lunes = 0
  const lunes = new Date(Date.UTC(y, m - 1, d - retroceso));
  return lunes.toISOString().slice(0, 10);
}

export interface EntradaCupo {
  esSocio: boolean;
  /** Fechas de turno de las reservas activas (futuras y no canceladas) del usuario. */
  fechasActivas: string[];
  fechaNuevoTurno: string;
}

export function tieneCupoSemanal({ esSocio, fechasActivas, fechaNuevoTurno }: EntradaCupo): boolean {
  const limite = esSocio ? LIMITE_RESERVAS_POR_SEMANA.socio : LIMITE_RESERVAS_POR_SEMANA.noSocio;
  const semana = inicioDeSemana(fechaNuevoTurno);
  const enLaSemana = fechasActivas.filter((f) => inicioDeSemana(f) === semana).length;
  return enLaSemana < limite;
}
