const request = require('supertest');
const app = require('../server');

describe('Investment API', () => {
  let token;

  const testUser = {
    name: 'Inv User',
    email: 'inv@example.com',
    password: 'password123',
  };

  const sampleInvestment = {
    assetName: 'TCS',
    assetType: 'Equity',
    purchaseDate: '2024-01-15',
    purchasePrice: 3500,
    quantity: 10,
    notes: 'Long term hold',
  };

  beforeEach(async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    token = res.body.token;
  });

  describe('POST /api/investments', () => {
    it('should create a new investment', async () => {
      const res = await request(app)
        .post('/api/investments')
        .set('Authorization', `Bearer ${token}`)
        .send(sampleInvestment);

      expect(res.statusCode).toBe(201);
      expect(res.body.assetName).toBe('TCS');
      expect(res.body.assetType).toBe('Equity');
      expect(res.body.purchasePrice).toBe(3500);
      expect(res.body.quantity).toBe(10);
      expect(res.body).toHaveProperty('currentPrice');
      expect(res.body).toHaveProperty('_id');
    });

    it('should reject creation without auth', async () => {
      const res = await request(app)
        .post('/api/investments')
        .send(sampleInvestment);

      expect(res.statusCode).toBe(401);
    });

    it('should reject invalid asset type', async () => {
      const res = await request(app)
        .post('/api/investments')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...sampleInvestment, assetType: 'InvalidType' });

      expect(res.statusCode).toBe(400);
    });

    it('should reject missing required fields', async () => {
      const res = await request(app)
        .post('/api/investments')
        .set('Authorization', `Bearer ${token}`)
        .send({ assetName: 'TCS' });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/investments', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/investments')
        .set('Authorization', `Bearer ${token}`)
        .send(sampleInvestment);
      await request(app)
        .post('/api/investments')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...sampleInvestment, assetName: 'Infosys', assetType: 'Equity' });
      await request(app)
        .post('/api/investments')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...sampleInvestment, assetName: 'Bitcoin', assetType: 'Crypto' });
    });

    it('should list all user investments', async () => {
      const res = await request(app)
        .get('/api/investments')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(3);
    });

    it('should filter by asset type', async () => {
      const res = await request(app)
        .get('/api/investments?assetType=Crypto')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].assetName).toBe('Bitcoin');
    });

    it('should search by asset name', async () => {
      const res = await request(app)
        .get('/api/investments?search=TCS')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].assetName).toBe('TCS');
    });

    it('should not return other users investments', async () => {
      const otherUser = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Other', email: 'other@example.com', password: 'pass123456' });

      const res = await request(app)
        .get('/api/investments')
        .set('Authorization', `Bearer ${otherUser.body.token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(0);
    });
  });

  describe('GET /api/investments/:id', () => {
    it('should get a single investment', async () => {
      const createRes = await request(app)
        .post('/api/investments')
        .set('Authorization', `Bearer ${token}`)
        .send(sampleInvestment);

      const res = await request(app)
        .get(`/api/investments/${createRes.body._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.assetName).toBe('TCS');
    });

    it('should return 404 for non-existent investment', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .get(`/api/investments/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /api/investments/:id', () => {
    it('should update an investment', async () => {
      const createRes = await request(app)
        .post('/api/investments')
        .set('Authorization', `Bearer ${token}`)
        .send(sampleInvestment);

      const res = await request(app)
        .put(`/api/investments/${createRes.body._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ ...sampleInvestment, quantity: 20, notes: 'Updated' });

      expect(res.statusCode).toBe(200);
      expect(res.body.quantity).toBe(20);
      expect(res.body.notes).toBe('Updated');
    });

    it('should return 404 when updating non-existent investment', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .put(`/api/investments/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(sampleInvestment);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/investments/:id', () => {
    it('should delete an investment', async () => {
      const createRes = await request(app)
        .post('/api/investments')
        .set('Authorization', `Bearer ${token}`)
        .send(sampleInvestment);

      const res = await request(app)
        .delete(`/api/investments/${createRes.body._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/deleted/i);

      // Verify it's gone
      const getRes = await request(app)
        .get(`/api/investments/${createRes.body._id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(getRes.statusCode).toBe(404);
    });

    it('should return 404 when deleting non-existent investment', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .delete(`/api/investments/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
    });
  });
});
