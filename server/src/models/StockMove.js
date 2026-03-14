const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const StockMove = sequelize.define('StockMove', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    pickingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'picking_id',
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'product_id',
    },
    srcLocationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'src_location_id',
    },
    destLocationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'dest_location_id',
    },
    demandQty: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'demand_qty',
    },
    doneQty: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        field: 'done_qty',
    },
    status: {
        type: DataTypes.ENUM('draft', 'done', 'cancelled'),
        defaultValue: 'draft',
    },
}, {
    tableName: 'stock_moves',
    timestamps: true,
});

module.exports = StockMove;
