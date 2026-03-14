process.env.JWT_SECRET = 'test_secret';
process.env.NODE_ENV = 'test';

const request = require('supertest');
const { makeToken } = require('../helpers/jwt');
const authHeader = makeToken();

jest.mock('../../src/models', () => ({
  sequelize: { authenticate: jest.fn(), sync: jest.fn() },
  Location: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  },
  Warehouse: {
    findAll: jest.fn(),
  },
  Category: {},
  Product: {},
}));

const { Location } = require('../../src/models');
const app = require('../../src/app');

describe('GET /api/locations', () => {
  it('returns 200 with locations array', async () => {
    Location.findAll.mockResolvedValue([
      { id: 1, name: 'Shelf A', warehouse: { id: 1, name: 'Main WH' } }
    ]);

    const res = await request(app).get('/api/locations').set('Authorization', authHeader);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('locations');
    expect(Array.isArray(res.body.locations)).toBe(true);
  });

  it('returns 500 on DB error', async () => {
    Location.findAll.mockRejectedValue(new Error('DB error'));
    const res = await request(app).get('/api/locations').set('Authorization', authHeader);
    expect(res.status).toBe(500);
  });
});

describe('POST /api/locations', () => {
  it('returns 400 if warehouseId or name is missing', async () => {
    const res = await request(app).post('/api/locations').set('Authorization', authHeader).send({ name: 'Shelf B' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/warehouseId/i);
  });

  it('returns 201 with created location', async () => {
    const mockLoc = { id: 3, name: 'Shelf B', warehouseId: 1 };
    Location.create.mockResolvedValue(mockLoc);

    const res = await request(app)
      .post('/api/locations')
      .set('Authorization', authHeader)
      .send({ name: 'Shelf B', warehouseId: 1 });

    expect(res.status).toBe(201);
    expect(res.body.location).toMatchObject({ id: 3, name: 'Shelf B' });
  });
});
