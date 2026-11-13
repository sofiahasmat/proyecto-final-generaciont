// RN-01 y RN-02. Valores tomados literalmente de docs/spec.md.
export type Deporte = 'FUTBOL_5' | 'PADEL' | 'TENIS';

export const INVENTARIO: Record<Deporte, { canchas: number; duracionMin: number }> = {
  FUTBOL_5: { canchas: 2, duracionMin: 60 },
  PADEL: { canchas: 3, duracionMin: 90 },
  TENIS: { canchas: 1, duracionMin: 90 },
};

export const HORARIO_CLUB = { apertura: '08:00', cierre: '00:00' } as const;
