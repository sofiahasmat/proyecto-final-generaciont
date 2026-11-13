// RN-07 y RN-09. Importes en centavos enteros.
// PA-14 (provisorio): cada componente se redondea al centavo más cercano.

export interface EntradaPrecio {
  precioBaseCentavos: number;
  esSocio: boolean;
  esPico: boolean; // la determinación de "pico" queda fuera hasta resolver PA-03/PA-04
}

const DESCUENTO_SOCIO_PCT = 20;
const RECARGO_PICO_PCT = 30;
const PENALIDAD_TARDIA_PCT = 50;

const pct = (centavos: number, porcentaje: number): number => Math.round((centavos * porcentaje) / 100);

export function calcularPrecioFinal({ precioBaseCentavos, esSocio, esPico }: EntradaPrecio): number {
  if (!Number.isInteger(precioBaseCentavos) || precioBaseCentavos < 0) {
    throw new RangeError('El precio base debe ser un entero de centavos >= 0');
  }
  const descuento = esSocio ? pct(precioBaseCentavos, DESCUENTO_SOCIO_PCT) : 0;
  const recargo = esPico ? pct(precioBaseCentavos, RECARGO_PICO_PCT) : 0;
  return precioBaseCentavos - descuento + recargo;
}

// RN-09: 50% del precio final que le correspondía pagar al usuario.
export function calcularPenalidad(precioFinalCentavos: number): number {
  return pct(precioFinalCentavos, PENALIDAD_TARDIA_PCT);
}
