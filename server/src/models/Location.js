const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Location = sequelize.define('Location', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: true,   // ← Phase 1: nullable so ALTER TABLE works on existing rows
        unique: true,
    },
    warehouseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'warehouse_id',
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('internal', 'supplier', 'customer', 'production'),
        defaultValue: 'internal',
    },
}, {
    tableName: 'locations',
    timestamps: true,
});

module.exports = Location;
