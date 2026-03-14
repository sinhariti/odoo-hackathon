process.env.JWT_SECRET = 'test_secret';
process.env.NODE_ENV = 'test';

const request = require('supertest');
const { makeToken } = require('../helpers/jwt');

const mockAdjustment = {
  id: 10,
  productId: 1,
  locationId: 1,
  countedQty: 50,
  systemQty: 45,
  difference: 5,
  status: 'draft',
  reason: 'Cycle count',
  update: jest.fn(),
};

const mockAppliedAdjustment = { ...mockAdjustment, status: 'applied', update: jest.fn() };

const mockTransaction = {
  commit: jest.fn().mockResolvedValue(true),
  rollback: jest.fn().mockResolvedValue(true),
};

jest.mock('../../src/models', () => ({
  sequelize: {
    authenticate: jest.fn(),
    sync: jest.fn(),
    transaction: jest.fn(),
  },
  StockAdjustment: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  },
  StockQuant: {
    findOne: jest.fn(),
    findOrCreate: jest.fn(),
  },
  Product: { findAll: jest.fn() },
  Location: { findAll: jest.fn() },
  User: {},
  Warehouse: {},
  Category: {},
}));

const { StockAdjustment, StockQuant, sequelize } = require('../../src/models');
const app = require('../../src/app');

const authHeader = makeToken({ id: 1, email: 'admin@test.com', role: 'admin' });

describe('POST /api/adjustments', () => {
  it('returns 401 without auth token', async () => {
    const res = await request(app).post('/api/adjustments').send({});
    expect(res.status).toBe(401);
  });

  it('returns 400 if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/adjustments')
      .set('Authorization', authHeader)
      .send({ locationId: 1 }); // missing productId and countedQty

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/required/i);
  });

  it('returns 201 with created adjustment', async () => {
    StockQuant.findOne.mockResolvedValue({ quantity: 45 });
    StockAdjustment.create.mockResolvedValue(mockAdjustment);

    const res = await request(app)
      .post('/api/adjustments')
      .set('Authorization', authHeader)
      .send({ productId: 1, locationId: 1, countedQty: 50, reason: 'Cycle count' });

    expect(res.status).toBe(201);
    expect(res.body.adjustment).toHaveProperty('id', 10);
  });
});

describe('POST /api/adjustments/:id/validate', () => {
  it('returns 404 if adjustment not found', async () => {
    sequelize.transaction.mockResolvedValue(mockTransaction);
    StockAdjustment.findByPk.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/adjustments/999/validate')
      .set('Authorization', authHeader);

    expect(res.status).toBe(404);
  });

  it('returns 400 if adjustment is already applied', async () => {
    sequelize.transaction.mockResolvedValue(mockTransaction);
    StockAdjustment.findByPk.mockResolvedValue(mockAppliedAdjustment);

    const res = await request(app)
      .post('/api/adjustments/10/validate')
      .set('Authorization', authHeader);

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/already applied/i);
  });

  it('returns 200 on successful validation', async () => {
    // Status must be 'draft' so the already-applied guard doesn't block it
    const draftAdj = { ...mockAdjustment, status: 'draft', update: jest.fn().mockResolvedValue(true) };
    sequelize.transaction.mockResolvedValue(mockTransaction);
    StockAdjustment.findByPk.mockResolvedValue(draftAdj);
    StockQuant.findOrCreate.mockResolvedValue([
      { quantity: 45, update: jest.fn().mockResolvedValue(true) }, false
    ]);

    const res = await request(app)
      .post('/api/adjustments/10/validate')
      .set('Authorization', authHeader);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/applied/i);
  });
});

describe('GET /api/adjustments', () => {
  it('returns 401 without auth token', async () => {
    const res = await request(app).get('/api/adjustments');
    expect(res.status).toBe(401);
  });

  it('returns 200 with adjustments list', async () => {
    StockAdjustment.findAll.mockResolvedValue([mockAdjustment]);

    const res = await request(app)
      .get('/api/adjustments')
      .set('Authorization', authHeader);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.adjustments)).toBe(true);
  });
});
