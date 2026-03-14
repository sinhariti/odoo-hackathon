const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Warehouse = sequelize.define('Warehouse', {
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
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'warehouses',
    timestamps: true,
});

module.exports = Warehouse;
