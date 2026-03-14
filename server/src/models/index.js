const sequelize = require('../config/db');
const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const Warehouse = require('./Warehouse');
const Location = require('./Location');
const StockQuant = require('./StockQuant');
const StockPicking = require('./StockPicking');
const StockMove = require('./StockMove');
const StockAdjustment = require('./StockAdjustment');
const ReorderingRule = require('./ReorderingRule');

// ── Product ↔ Category ──
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// ── Location ↔ Warehouse ──
Warehouse.hasMany(Location, { foreignKey: 'warehouseId', as: 'locations' });
Location.belongsTo(Warehouse, { foreignKey: 'warehouseId', as: 'warehouse' });

// ── StockQuant ↔ Product & Location ──
Product.hasMany(StockQuant, { foreignKey: 'productId', as: 'quants' });
StockQuant.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Location.hasMany(StockQuant, { foreignKey: 'locationId', as: 'quants' });
StockQuant.belongsTo(Location, { foreignKey: 'locationId', as: 'location' });

// ── StockPicking ↔ Location & User ──
StockPicking.belongsTo(Location, { foreignKey: 'srcLocationId', as: 'srcLocation' });
StockPicking.belongsTo(Location, { foreignKey: 'destLocationId', as: 'destLocation' });
StockPicking.belongsTo(User, { foreignKey: 'createdById', as: 'createdBy' });
StockPicking.hasMany(StockMove, { foreignKey: 'pickingId', as: 'moves' });

// ── StockMove ↔ Picking, Product, Location ──
StockMove.belongsTo(StockPicking, { foreignKey: 'pickingId', as: 'picking' });
StockMove.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
StockMove.belongsTo(Location, { foreignKey: 'srcLocationId', as: 'srcLocation' });
StockMove.belongsTo(Location, { foreignKey: 'destLocationId', as: 'destLocation' });

// ── StockAdjustment ↔ Product, Location, User ──
StockAdjustment.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
StockAdjustment.belongsTo(Location, { foreignKey: 'locationId', as: 'location' });
StockAdjustment.belongsTo(User, { foreignKey: 'createdById', as: 'createdBy' });

// ── ReorderingRule ↔ Product, Location ──
ReorderingRule.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
ReorderingRule.belongsTo(Location, { foreignKey: 'locationId', as: 'location' });

module.exports = {
    sequelize,
    User,
    Category,
    Product,
    Warehouse,
    Location,
    StockQuant,
    StockPicking,
    StockMove,
    StockAdjustment,
    ReorderingRule,
};
