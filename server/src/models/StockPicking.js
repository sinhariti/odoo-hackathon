const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const StockPicking = sequelize.define('StockPicking', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    type: {
        type: DataTypes.ENUM('receipt', 'delivery', 'internal'),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('draft', 'waiting', 'ready', 'done', 'cancelled'),
        defaultValue: 'draft',
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
    supplierName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'supplier_name',
    },
    customerName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'customer_name',
    },
    createdById: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'created_by_id',
    },
    scheduledDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'scheduled_date',
    },
    doneDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'done_date',
    },
}, {
    tableName: 'stock_pickings',
    timestamps: true,
});

module.exports = StockPicking;
