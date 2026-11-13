import { HORARIO_CLUB, INVENTARIO, type Deporte } from './canchas.js';

// RN-17: bloques fijos que arrancan a las 08:00 y se encadenan sin huecos hasta el cierre (RN-02).
export interface Turno {
  inicio: string; // 'HH:MM'
  fin: string; // 'HH:MM' (24:00 se muestra como 00:00)
  inicioMin: number; // minutos desde las 00:00
  finMin: number;
}

const aMin = (hhmm: string): number => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

const aHHMM = (min: number): string => {
  const m = min % (24 * 60);
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};

export function generarGrilla(deporte: Deporte): Turno[] {
  const { duracionMin } = INVENTARIO[deporte];
  const apertura = aMin(HORARIO_CLUB.apertura);
  const cierre = 24 * 60; // 00:00 = fin del día
  const turnos: Turno[] = [];
  for (let inicio = apertura; inicio + duracionMin <= cierre; inicio += duracionMin) {
    turnos.push({
      inicio: aHHMM(inicio),
      fin: aHHMM(inicio + duracionMin),
      inicioMin: inicio,
      finMin: inicio + duracionMin,
    });
  }
  return turnos;
}

export function esInicioValido(deporte: Deporte, inicio: string): boolean {
  return generarGrilla(deporte).some((t) => t.inicio === inicio);
}
