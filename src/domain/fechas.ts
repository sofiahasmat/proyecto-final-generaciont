// Utilidades puras de fecha/hora local ('YYYY-MM-DD' y 'HH:MM'). Sin zona horaria: el llamador
// entrega la fecha y hora ya expresadas en la hora local del club (ver PA-09).

export function parseFecha(fecha: string): { y: number; m: number; d: number } {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fecha);
  if (!match) throw new RangeError(`Fecha inválida: ${fecha}`);
  const [y, m, d] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) {
    throw new RangeError(`Fecha inexistente: ${fecha}`);
  }
  return { y, m, d };
}

/** 0 = domingo … 6 = sábado */
export function diaDeSemana(fecha: string): number {
  const { y, m, d } = parseFecha(fecha);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function parseHoraEnMinutos(hhmm: string): number {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(hhmm);
  if (!match) throw new RangeError(`Hora inválida: ${hhmm}`);
  return Number(match[1]) * 60 + Number(match[2]);
}

/** Suma días de calendario a una fecha 'YYYY-MM-DD'. */
export function sumarDias(fecha: string, dias: number): string {
  const { y, m, d } = parseFecha(fecha);
  return new Date(Date.UTC(y, m - 1, d + dias)).toISOString().slice(0, 10);
}

/** Días de calendario entre dos fechas 'YYYY-MM-DD' (hasta - desde). */
export function diasEntre(desde: string, hasta: string): number {
  const a = parseFecha(desde);
  const b = parseFecha(hasta);
  return Math.round((Date.UTC(b.y, b.m - 1, b.d) - Date.UTC(a.y, a.m - 1, a.d)) / 86_400_000);
}
