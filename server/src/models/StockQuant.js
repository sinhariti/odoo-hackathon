const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const StockQuant = sequelize.define('StockQuant', {
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
    quantity: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
}, {
    tableName: 'stock_quants',
    timestamps: true,
    indexes: [
        { unique: true, fields: ['product_id', 'location_id'] },
    ],
});

module.exports = StockQuant;
