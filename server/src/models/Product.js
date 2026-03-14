const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sku: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'category_id',
    },
    uom: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'units',
        comment: 'Unit of Measure: units, kg, liters, etc.',
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'products',
    timestamps: true,
});

module.exports = Product;
