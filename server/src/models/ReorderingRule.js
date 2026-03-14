const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ReorderingRule = sequelize.define('ReorderingRule', {
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
        allowNull: true,
        field: 'location_id',
    },
    minQty: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'min_qty',
    },
}, {
    tableName: 'reordering_rules',
    timestamps: true,
});

module.exports = ReorderingRule;
