process.env.JWT_SECRET = 'test_secret';
process.env.NODE_ENV = 'test';

const request = require('supertest');
const { makeToken } = require('../helpers/jwt');
const authHeader = makeToken();

jest.mock('../../src/models', () => ({
  sequelize: { authenticate: jest.fn(), sync: jest.fn() },
  Category: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  },
  Product: {
    count: jest.fn(),
  },
  Warehouse: {},
  Location: {},
}));

const { Category, Product } = require('../../src/models');
const app = require('../../src/app');

describe('GET /api/categories', () => {
  it('returns 200 with categories array', async () => {
    Category.findAll.mockResolvedValue([{ id: 1, name: 'Electronics' }]);

    const res = await request(app).get('/api/categories').set('Authorization', authHeader);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('categories');
    expect(Array.isArray(res.body.categories)).toBe(true);
  });
});

describe('POST /api/categories', () => {
  it('returns 400 if name is missing', async () => {
    const res = await request(app).post('/api/categories').set('Authorization', authHeader).send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/name/i);
  });

  it('returns 201 with created category', async () => {
    const mockCat = { id: 5, name: 'Furniture' };
    Category.create.mockResolvedValue(mockCat);

    const res = await request(app)
      .post('/api/categories')
      .set('Authorization', authHeader)
      .send({ name: 'Furniture' });

    expect(res.status).toBe(201);
    expect(res.body.category).toMatchObject({ id: 5, name: 'Furniture' });
  });

  it('returns 409 on duplicate name', async () => {
    const err = new Error('Duplicate');
    err.name = 'SequelizeUniqueConstraintError';
    Category.create.mockRejectedValue(err);

    const res = await request(app).post('/api/categories').set('Authorization', authHeader).send({ name: 'Furniture' });
    expect(res.status).toBe(409);
  });
});

describe('DELETE /api/categories/:id', () => {
  it('returns 404 if category not found', async () => {
    Category.findByPk.mockResolvedValue(null);
    const res = await request(app).delete('/api/categories/999').set('Authorization', authHeader);
    expect(res.status).toBe(404);
  });

  it('returns 400 if category has products assigned', async () => {
    Category.findByPk.mockResolvedValue({ id: 1, name: 'Electronics' });
    Product.count.mockResolvedValue(3);

    const res = await request(app).delete('/api/categories/1').set('Authorization', authHeader);
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/product/i);
  });

  it('returns 200 on successful delete', async () => {
    Category.findByPk.mockResolvedValue({ id: 2, name: 'Empty Cat', destroy: jest.fn().mockResolvedValue(true) });
    Product.count.mockResolvedValue(0);

    const res = await request(app).delete('/api/categories/2').set('Authorization', authHeader);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
