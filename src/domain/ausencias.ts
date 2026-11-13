import { diasEntre, parseFecha, sumarDias } from './fechas.js';

// RN-11 / RN-12 (PA-13, PA-19). Fechas locales del club ('YYYY-MM-DD').
// Límites exactos pendientes de confirmar (PA-23): la ventana incluye el día 30 hacia atrás
// y el usuario queda libre el día (fecha de la 3.ª falta + 15).
export const VENTANA_AUSENCIAS_DIAS = 30;
export const AUSENCIAS_PARA_BLOQUEO = 3;
export const DIAS_BLOQUEO = 15;

export interface EntradaAusencia {
  fechasPrevias: string[]; // fechas de ausencias ya registradas
  fechaNueva: string; // fecha de la nueva falta registrada por el administrador
  /** Fecha en que terminó el último bloqueo cumplido: reinicia el contador (PA-19). */
  finUltimoBloqueo?: string;
}

export interface ResultadoAusencia {
  ausenciasEnVentana: number;
  bloquea: boolean;
  bloqueadoHasta?: string;
}

export function registrarAusencia({ fechasPrevias, fechaNueva, finUltimoBloqueo }: EntradaAusencia): ResultadoAusencia {
  parseFecha(fechaNueva);
  const previasQueCuentan = fechasPrevias.filter((f) => {
    const desdeReinicio = finUltimoBloqueo === undefined || f >= finUltimoBloqueo;
    const dias = diasEntre(f, fechaNueva);
    return desdeReinicio && dias >= 0 && dias <= VENTANA_AUSENCIAS_DIAS;
  });
  const ausenciasEnVentana = previasQueCuentan.length + 1;
  if (ausenciasEnVentana >= AUSENCIAS_PARA_BLOQUEO) {
    return { ausenciasEnVentana, bloquea: true, bloqueadoHasta: sumarDias(fechaNueva, DIAS_BLOQUEO) };
  }
  return { ausenciasEnVentana, bloquea: false };
}

/** Un usuario bloqueado no crea reservas nuevas (conserva las vigentes). */
export function estaBloqueado({ hoy, bloqueadoHasta }: { hoy: string; bloqueadoHasta?: string }): boolean {
  return bloqueadoHasta !== undefined && hoy < bloqueadoHasta;
}
