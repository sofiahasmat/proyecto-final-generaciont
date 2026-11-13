import { diaDeSemana, parseHoraEnMinutos } from './fechas.js';

// RN-06 (decisiones PA-03 y PA-04):
// - Sábado y domingo: pico todo el día.
// - Lunes a viernes: pico si la HORA DE INICIO del turno está en [18:00, 23:00).
const PICO_DESDE_MIN = 18 * 60;
const PICO_HASTA_MIN = 23 * 60; // excluido

export function esHorarioPico(fecha: string, inicio: string): boolean {
  const dia = diaDeSemana(fecha);
  const minutos = parseHoraEnMinutos(inicio);
  if (dia === 0 || dia === 6) return true;
  return minutos >= PICO_DESDE_MIN && minutos < PICO_HASTA_MIN;
}
