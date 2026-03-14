process.env.JWT_SECRET = 'test_secret';
process.env.NODE_ENV = 'test';

const request = require('supertest');
const { makeToken } = require('../helpers/jwt');
const authHeader = makeToken();

// ── Mock Sequelize models ──────────────────────────────────────────────────
jest.mock('../../src/models', () => ({
  sequelize: { authenticate: jest.fn(), sync: jest.fn() },
  Warehouse: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  },
  Location: {},
}));

const { Warehouse } = require('../../src/models');
const app = require('../../src/app');

describe('GET /api/warehouses', () => {
  it('returns 200 with warehouses array', async () => {
    Warehouse.findAll.mockResolvedValue([{ id: 1, name: 'Main WH', shortCode: 'MWH' }]);

    const res = await request(app).get('/api/warehouses').set('Authorization', authHeader);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('warehouses');
    expect(Array.isArray(res.body.warehouses)).toBe(true);
  });

  it('returns 500 on DB error', async () => {
    Warehouse.findAll.mockRejectedValue(new Error('DB failure'));

    const res = await request(app).get('/api/warehouses').set('Authorization', authHeader);
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});

describe('POST /api/warehouses', () => {
  it('returns 400 if name is missing', async () => {
    const res = await request(app).post('/api/warehouses').set('Authorization', authHeader).send({ address: '123 Street' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/name/i);
  });

  it('returns 201 with created warehouse', async () => {
    const mockWH = { id: 2, name: 'East Hub', address: '456 Ave' };
    Warehouse.create.mockResolvedValue(mockWH);

    const res = await request(app)
      .post('/api/warehouses')
      .set('Authorization', authHeader)
      .send({ name: 'East Hub', address: '456 Ave' });

    expect(res.status).toBe(201);
    expect(res.body.warehouse).toMatchObject({ id: 2, name: 'East Hub' });
  });

  it('returns 409 on duplicate name', async () => {
    const err = new Error('Duplicate');
    err.name = 'SequelizeUniqueConstraintError';
    Warehouse.create.mockRejectedValue(err);

    const res = await request(app)
      .post('/api/warehouses')
      .set('Authorization', authHeader)
      .send({ name: 'East Hub' });

    expect(res.status).toBe(409);
  });
});

describe('DELETE /api/warehouses/:id', () => {
  it('returns 404 if warehouse not found', async () => {
    Warehouse.findByPk.mockResolvedValue(null);

    const res = await request(app).delete('/api/warehouses/999').set('Authorization', authHeader);
    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });

  it('returns 200 on successful delete', async () => {
    const mockInstance = { id: 1, destroy: jest.fn().mockResolvedValue(true) };
    Warehouse.findByPk.mockResolvedValue(mockInstance);

    const res = await request(app).delete('/api/warehouses/1').set('Authorization', authHeader);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
