import { describe, expect, it } from 'vitest';
import { instanteLocalClub } from '../src/domain/tiempo.js';

describe('instanteLocalClub: fecha + hora local del club -> instante UTC (PA-09)', () => {
  it('Buenos Aires es UTC-3', () => {
    expect(instanteLocalClub('2026-11-12', '08:00').toISOString()).toBe('2026-11-12T11:00:00.000Z');
    expect(instanteLocalClub('2026-11-12', '18:00').toISOString()).toBe('2026-11-12T21:00:00.000Z');
    expect(instanteLocalClub('2026-11-12', '23:30').toISOString()).toBe('2026-11-13T02:30:00.000Z');
  });
});
