const request = require('supertest');
const app = require('../server');

describe('Portfolio & Export API', () => {
  let token;

  const testUser = {
    name: 'Portfolio User',
    email: 'portfolio@example.com',
    password: 'password123',
  };

  const investments = [
    { assetName: 'TCS', assetType: 'Equity', purchaseDate: '2024-01-15', purchasePrice: 3500, quantity: 10 },
    { assetName: 'Bitcoin', assetType: 'Crypto', purchaseDate: '2024-03-01', purchasePrice: 50000, quantity: 0.5 },
    { assetName: 'HDFC Mid-Cap Fund', assetType: 'Mutual Fund', purchaseDate: '2024-06-10', purchasePrice: 100, quantity: 50 },
  ];

  beforeEach(async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    token = res.body.token;

    for (const inv of investments) {
      await request(app)
        .post('/api/investments')
        .set('Authorization', `Bearer ${token}`)
        .send(inv);
    }
  });

  describe('GET /api/portfolio/dashboard', () => {
    it('should return dashboard data with summary', async () => {
      const res = await request(app)
        .get('/api/portfolio/dashboard')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('summary');
      expect(res.body.summary).toHaveProperty('totalInvested');
      expect(res.body.summary).toHaveProperty('totalCurrentValue');
      expect(res.body.summary).toHaveProperty('totalGainLoss');
      expect(res.body.summary).toHaveProperty('totalGainLossPercent');
      expect(res.body.summary.totalAssets).toBe(3);
    });

    it('should return diversification breakdown', async () => {
      const res = await request(app)
        .get('/api/portfolio/dashboard')
        .set('Authorization', `Bearer ${token}`);

      expect(res.body).toHaveProperty('diversification');
      expect(res.body.diversification.length).toBeGreaterThan(0);

      const types = res.body.diversification.map((d) => d._id);
      expect(types).toContain('Equity');
      expect(types).toContain('Crypto');
      expect(types).toContain('Mutual Fund');

      // Percentages should add up to ~100%
      const totalPct = res.body.diversification.reduce((sum, d) => sum + d.percentage, 0);
      expect(totalPct).toBeCloseTo(100, 0);
    });

    it('should return historical performance data', async () => {
      const res = await request(app)
        .get('/api/portfolio/dashboard')
        .set('Authorization', `Bearer ${token}`);

      expect(res.body).toHaveProperty('historicalPerformance');
      expect(res.body.historicalPerformance.length).toBeGreaterThan(0);
      expect(res.body.historicalPerformance[0]).toHaveProperty('date');
      expect(res.body.historicalPerformance[0]).toHaveProperty('value');
    });

    it('should filter by asset type', async () => {
      const res = await request(app)
        .get('/api/portfolio/dashboard?assetType=Crypto')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.summary.totalAssets).toBe(1);
      expect(res.body.investments[0].assetType).toBe('Crypto');
    });

    it('should filter gainers only', async () => {
      const res = await request(app)
        .get('/api/portfolio/dashboard?filter=gainers')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      res.body.investments.forEach((inv) => {
        expect(inv.gainLoss).toBeGreaterThan(0);
      });
    });

    it('should filter losers only', async () => {
      const res = await request(app)
        .get('/api/portfolio/dashboard?filter=losers')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      res.body.investments.forEach((inv) => {
        expect(inv.gainLoss).toBeLessThan(0);
      });
    });

    it('should reject without auth', async () => {
      const res = await request(app).get('/api/portfolio/dashboard');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/export/pdf', () => {
    it('should download a PDF file', async () => {
      const res = await request(app)
        .get('/api/export/pdf')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toMatch(/pdf/);
      expect(res.headers['content-disposition']).toMatch(/portfolio-summary\.pdf/);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should reject without auth', async () => {
      const res = await request(app).get('/api/export/pdf');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/export/csv', () => {
    it('should download a CSV file', async () => {
      const res = await request(app)
        .get('/api/export/csv')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toMatch(/csv/);
      expect(res.headers['content-disposition']).toMatch(/portfolio-summary\.csv/);
      // CSV should contain header and data rows
      const csvText = res.text;
      expect(csvText).toContain('Asset Name');
      expect(csvText).toContain('TCS');
      expect(csvText).toContain('Bitcoin');
    });

    it('should reject without auth', async () => {
      const res = await request(app).get('/api/export/csv');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/api/health');

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('OK');
      expect(res.body).toHaveProperty('timestamp');
    });
  });
});
