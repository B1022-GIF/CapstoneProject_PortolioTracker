const { getPrice, getHistoricalData, getBulkPrices } = require('../services/marketData');
const { generatePortfolioCSV } = require('../services/csvService');
const { calcGainLoss } = require('../utils/helpers');

describe('Market Data Service', () => {
  describe('getPrice', () => {
    it('should return exact price for known asset', () => {
      expect(getPrice('TCS')).toBe(3820.50);
      expect(getPrice('Bitcoin')).toBe(67250.00);
      expect(getPrice('Apple')).toBe(185.50);
    });

    it('should return price for partial case-insensitive match', () => {
      const price = getPrice('Reliance');
      expect(price).toBe(2450.75);
    });

    it('should return a positive number for unknown asset', () => {
      const price = getPrice('UnknownAssetXYZ');
      expect(price).toBeGreaterThan(0);
      expect(typeof price).toBe('number');
    });
  });

  describe('getHistoricalData', () => {
    it('should return array of date-price objects', () => {
      const data = getHistoricalData('TCS', 10);
      expect(data).toHaveLength(11); // 10 days + today
      expect(data[0]).toHaveProperty('date');
      expect(data[0]).toHaveProperty('price');
    });

    it('should return prices as positive numbers', () => {
      const data = getHistoricalData('Bitcoin', 5);
      data.forEach((point) => {
        expect(point.price).toBeGreaterThan(0);
        expect(typeof point.price).toBe('number');
      });
    });

    it('should return dates in chronological order', () => {
      const data = getHistoricalData('Apple', 7);
      for (let i = 1; i < data.length; i++) {
        expect(new Date(data[i].date) >= new Date(data[i - 1].date)).toBe(true);
      }
    });

    it('should default to 30 days', () => {
      const data = getHistoricalData('TCS');
      expect(data).toHaveLength(31);
    });
  });

  describe('getBulkPrices', () => {
    it('should return prices for multiple assets', () => {
      const prices = getBulkPrices(['TCS', 'Bitcoin', 'Apple']);
      expect(Object.keys(prices)).toHaveLength(3);
      expect(prices['TCS']).toBe(3820.50);
      expect(prices['Bitcoin']).toBe(67250.00);
      expect(prices['Apple']).toBe(185.50);
    });

    it('should handle empty array', () => {
      const prices = getBulkPrices([]);
      expect(Object.keys(prices)).toHaveLength(0);
    });
  });
});

describe('CSV Service', () => {
  it('should generate valid CSV output', () => {
    const investments = [
      {
        assetName: 'TCS',
        assetType: 'Equity',
        purchaseDate: '2024-01-15T00:00:00.000Z',
        purchasePrice: 3500,
        quantity: 10,
        currentPrice: 3820.50,
      },
      {
        assetName: 'Bitcoin',
        assetType: 'Crypto',
        purchaseDate: '2024-03-01T00:00:00.000Z',
        purchasePrice: 50000,
        quantity: 0.5,
        currentPrice: 67250,
      },
    ];

    const csv = generatePortfolioCSV(investments);

    expect(csv).toContain('Asset Name');
    expect(csv).toContain('TCS');
    expect(csv).toContain('Bitcoin');
    expect(csv).toContain('Equity');
    expect(csv).toContain('Crypto');
  });

  it('should handle empty investments array', () => {
    const csv = generatePortfolioCSV([]);
    expect(csv).toContain('Asset Name');
  });
});

describe('Helper Utilities', () => {
  describe('calcGainLoss', () => {
    it('should calculate gain correctly', () => {
      const result = calcGainLoss(100, 150, 10);
      expect(result.invested).toBe(1000);
      expect(result.current).toBe(1500);
      expect(result.gainLoss).toBe(500);
      expect(result.gainLossPercent).toBe(50);
    });

    it('should calculate loss correctly', () => {
      const result = calcGainLoss(200, 150, 5);
      expect(result.invested).toBe(1000);
      expect(result.current).toBe(750);
      expect(result.gainLoss).toBe(-250);
      expect(result.gainLossPercent).toBe(-25);
    });

    it('should handle zero purchase price', () => {
      const result = calcGainLoss(0, 100, 10);
      expect(result.invested).toBe(0);
      expect(result.gainLossPercent).toBe(0);
    });
  });
});
