
import { describe, it, expect } from 'vitest';
import { calculateDifference, parseRawInput, formatNumber, formatDateLocal } from './timeUtils';

describe('timeUtils', () => {
  describe('calculateDifference', () => {
    it('calculates difference between same dates as zero', () => {
      const d1 = new Date('2024-01-01T00:00:00Z');
      const diff = calculateDifference(d1, d1);
      
      expect(diff.totalMilliseconds).toBe(0);
      expect(diff.years).toBe(0);
      expect(diff.months).toBe(0);
      expect(diff.days).toBe(0);
      expect(diff.hours).toBe(0);
      expect(diff.minutes).toBe(0);
      expect(diff.seconds).toBe(0);
      expect(diff.milliseconds).toBe(0);
      expect(diff.isNegative).toBe(false);
    });

    it('calculates simple 1 hour difference correctly', () => {
      const start = new Date('2024-01-01T10:00:00Z');
      const end = new Date('2024-01-01T11:00:00Z');
      const diff = calculateDifference(start, end);

      expect(diff.hours).toBe(1);
      expect(diff.totalMilliseconds).toBe(3600000);
    });

    it('calculates 1 year difference correctly', () => {
      const start = new Date('2023-01-01T00:00:00Z');
      const end = new Date('2024-01-01T00:00:00Z');
      const diff = calculateDifference(start, end);

      expect(diff.years).toBe(1);
      expect(diff.months).toBe(0);
      expect(diff.days).toBe(0);
    });

    it('handles negative difference (end before start)', () => {
      const start = new Date('2024-01-02T00:00:00Z');
      const end = new Date('2024-01-01T00:00:00Z');
      const diff = calculateDifference(start, end);

      expect(diff.isNegative).toBe(true);
      expect(diff.days).toBe(1);
      expect(diff.totalMilliseconds).toBe(24 * 60 * 60 * 1000);
    });

    it('handles borrowing days from previous month (simple)', () => {
      const start = new Date('2024-01-30T00:00:00Z');
      const end = new Date('2024-02-01T00:00:00Z');
      const diff = calculateDifference(start, end);

      // Jan has 31 days. Jan 30 to Feb 1 is 2 days.
      expect(diff.months).toBe(0);
      expect(diff.days).toBe(2);
    });

    it('handles borrowing days across leap year Feb', () => {
      // 2024 is a leap year (Feb has 29 days)
      const start = new Date('2024-02-28T00:00:00Z');
      const end = new Date('2024-03-01T00:00:00Z');
      const diff = calculateDifference(start, end);

      // Feb 28 -> Feb 29 (1) -> Mar 1 (2)
      expect(diff.days).toBe(2);
    });

    it('handles borrowing days across non-leap year Feb', () => {
      // 2023 is not a leap year (Feb has 28 days)
      const start = new Date('2023-02-28T00:00:00Z');
      const end = new Date('2023-03-01T00:00:00Z');
      const diff = calculateDifference(start, end);

      // Feb 28 -> Mar 1 (1)
      expect(diff.days).toBe(1);
    });
    
    it('handles precise ms differences', () => {
        const start = new Date(1000);
        const end = new Date(1500);
        const diff = calculateDifference(start, end);
        expect(diff.milliseconds).toBe(500);
    });
  });

  describe('parseRawInput', () => {
    it('parses valid ISO string', () => {
      const result = parseRawInput('2024-01-01T00:00:00Z');
      expect(result).not.toBeNull();
      expect(result?.toISOString()).toBe('2024-01-01T00:00:00.000Z');
    });

    it('parses numeric epoch string', () => {
      // 1704067200000 is 2024-01-01T00:00:00.000Z
      const result = parseRawInput('1704067200000');
      expect(result).not.toBeNull();
      expect(result?.getTime()).toBe(1704067200000);
    });

    it('returns null for invalid strings', () => {
      expect(parseRawInput('invalid-date')).toBeNull();
      expect(parseRawInput('')).toBeNull();
      expect(parseRawInput('   ')).toBeNull();
    });
    
    it('handles short dates', () => {
        const result = parseRawInput('2024-01-01');
        expect(result).not.toBeNull();
        expect(result?.getFullYear()).toBe(2024);
    });
  });

  describe('formatNumber', () => {
    it('formats numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1234567)).toBe('1,234,567');
      expect(formatNumber(0)).toBe('0');
    });
  });
  
  describe('formatDateLocal', () => {
      it('formats date to include ms', () => {
          const date = new Date('2023-01-01T12:00:00.123Z');
          // Output depends on timezone of runner, but should contain ".123"
          expect(formatDateLocal(date)).toContain('.123');
      });
  });
});
