// RN-10: el sistema no procesa pagos; registra deudas que se abonan en el club.
export type EstadoDeuda = 'PENDIENTE' | 'PAGADA';

export interface Deuda {
  montoCentavos: number;
  estado: EstadoDeuda;
}

/** Con alguna deuda pendiente no se pueden crear reservas nuevas hasta que el admin la marque PAGADA. */
export function tieneDeudaPendiente(deudas: Deuda[]): boolean {
  return deudas.some((d) => d.estado === 'PENDIENTE');
}
