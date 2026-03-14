/**
 * seed.js
 * -------
 * Populates the PostgreSQL database (via Sequelize) with dummy data from
 * the JSON files in this folder.
 *
 * Usage (from the `server` directory):
 *   node seed_data/seed.js
 *
 * The script will:
 *   1. Sync all tables (alter mode – safe for dev, does NOT drop data).
 *   2. Insert records in dependency order so FK constraints are satisfied.
 *   3. Skip records that already exist (based on primary key / unique fields).
 */

require('dotenv').config();

const path = require('path');
const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');

// ── Sequelize connection (mirrors src/config/db.js) ──────────────────────────
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
);

// ── Models ───────────────────────────────────────────────────────────────────
// Import from the existing model definitions so we get all associations.
const {
  User,
  Category,
  Warehouse,
  Location,
  Product,
  StockQuant,
  ReorderingRule,
  StockPicking,
  StockMove,
  StockAdjustment,
} = require('../src/models');

// ── Helpers ──────────────────────────────────────────────────────────────────
function load(filename) {
  return require(path.join(__dirname, filename));
}

async function bulkInsert(Model, records) {
  let inserted = 0;
  let skipped = 0;
  for (const record of records) {
    try {
      await Model.create(record);
      inserted++;
    } catch (err) {
      if (
        err.name === 'SequelizeUniqueConstraintError' ||
        err.name === 'SequelizeValidationError'
      ) {
        skipped++;
      } else {
        throw err;
      }
    }
  }
  console.log(`  ✔ ${Model.name}: ${inserted} inserted, ${skipped} skipped`);
}

// Hash plain-text passwords before inserting users
async function seedUsers(records) {
  let inserted = 0;
  let skipped = 0;
  for (const record of records) {
    try {
      const { password, ...rest } = record;
      const passwordHash = await bcrypt.hash(password, 10);
      await User.create({ ...rest, passwordHash });
      inserted++;
    } catch (err) {
      if (
        err.name === 'SequelizeUniqueConstraintError' ||
        err.name === 'SequelizeValidationError'
      ) {
        skipped++;
      } else {
        throw err;
      }
    }
  }
  console.log(`  ✔ User: ${inserted} inserted, ${skipped} skipped`);
}

// ── Main ─────────────────────────────────────────────────────────────────────
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅  Connected to database\n');

    // Sync schema (create tables if not exists, alter existing)
    await sequelize.sync({ alter: true });
    console.log('✅  Schema synced\n');

    // Disable FK checks temporarily so we can insert in bulk without ordering issues
    await sequelize.query('SET session_replication_role = replica;');

    console.log('📦  Seeding tables...\n');

    // Order matters: seed dependents after their parents
    await seedUsers(load('./users.json'));
    await bulkInsert(Warehouse,        load('./warehouses.json'));
    await bulkInsert(Category,         load('./categories.json'));
    await bulkInsert(Location,         load('./locations.json'));
    await bulkInsert(Product,          load('./products.json'));
    await bulkInsert(StockQuant,       load('./stock_quants.json'));
    await bulkInsert(ReorderingRule,   load('./reordering_rules.json'));
    await bulkInsert(StockPicking,     load('./stock_pickings.json'));
    await bulkInsert(StockMove,        load('./stock_moves.json'));
    await bulkInsert(StockAdjustment,  load('./stock_adjustments.json'));

    // Re-enable FK checks
    await sequelize.query('SET session_replication_role = DEFAULT;');

    // ── Reset sequences so auto-increment starts after the seeded IDs ──────
    console.log('\n🔧  Resetting sequences...\n');
    const tables = [
      'users', 'warehouses', 'categories', 'locations', 'products',
      'stock_quants', 'reordering_rules', 'stock_pickings', 'stock_moves', 'stock_adjustments',
    ];
    for (const table of tables) {
      await sequelize.query(
        `SELECT setval('${table}_id_seq', COALESCE((SELECT MAX(id) FROM "${table}"), 0) + 1, false);`
      );
      console.log(`  ✔ Reset sequence for ${table}`);
    }

    console.log('\n✅  Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('\n❌  Seeding failed:', err.message);
    console.error(err);
    process.exit(1);
  }
})();
