const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const StockAdjustment = sequelize.define('StockAdjustment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'product_id',
    },
    locationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'location_id',
    },
    countedQty: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'counted_qty',
    },
    systemQty: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'system_qty',
    },
    difference: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('draft', 'applied'),
        defaultValue: 'applied',
    },
    createdById: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'created_by_id',
    },
}, {
    tableName: 'stock_adjustments',
    timestamps: true,
});

module.exports = StockAdjustment;
