import { describe, it, expect } from 'vitest';
import { formatCurrency, formatPercent, formatDate, gainLossClass } from '../utils/format';

describe('formatCurrency', () => {
  it('should format positive amounts', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('should format zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('should format negative amounts', () => {
    expect(formatCurrency(-500.5)).toBe('-$500.50');
  });

  it('should format large numbers with commas', () => {
    expect(formatCurrency(1000000)).toBe('$1,000,000.00');
  });
});

describe('formatPercent', () => {
  it('should format positive percent with + sign', () => {
    expect(formatPercent(25.5)).toBe('+25.50%');
  });

  it('should format negative percent with - sign', () => {
    expect(formatPercent(-10.3)).toBe('-10.30%');
  });

  it('should format zero as positive', () => {
    expect(formatPercent(0)).toBe('+0.00%');
  });
});

describe('formatDate', () => {
  it('should format ISO date string', () => {
    const result = formatDate('2024-01-15T00:00:00.000Z');
    expect(result).toContain('Jan');
    expect(result).toContain('15');
    expect(result).toContain('2024');
  });

  it('should format date-only string', () => {
    const result = formatDate('2024-12-25');
    expect(result).toContain('Dec');
    expect(result).toContain('2024');
  });
});

describe('gainLossClass', () => {
  it('should return "gain" for positive values', () => {
    expect(gainLossClass(100)).toBe('gain');
    expect(gainLossClass(0.01)).toBe('gain');
  });

  it('should return "gain" for zero', () => {
    expect(gainLossClass(0)).toBe('gain');
  });

  it('should return "loss" for negative values', () => {
    expect(gainLossClass(-50)).toBe('loss');
    expect(gainLossClass(-0.01)).toBe('loss');
  });
});
