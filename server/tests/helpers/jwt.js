const jwt = require('jsonwebtoken');

const TEST_SECRET = 'test_secret';

/**
 * Returns a signed Bearer token string for tests.
 * @param {object} payload - e.g. { id: 1, email: 'test@example.com', role: 'user' }
 */
function makeToken(payload = { id: 1, email: 'test@example.com', role: 'user' }) {
  return `Bearer ${jwt.sign(payload, TEST_SECRET, { expiresIn: '1h' })}`;
}

module.exports = { makeToken, TEST_SECRET };
