const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const StockPicking = sequelize.define('StockPicking', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    reference: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
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

// Auto-generate reference like WH/IN/0001 on creation
const TYPE_CODE = { receipt: 'IN', delivery: 'OUT', internal: 'INT' };

StockPicking.beforeCreate(async (picking) => {
    const Location = require('./Location');
    const Warehouse = require('./Warehouse');

    // Try to resolve warehouse code from destination (or source) location
    let whCode = 'WH';
    const locId = picking.destLocationId || picking.srcLocationId;
    if (locId) {
        try {
            const loc = await Location.findByPk(locId);
            if (loc && loc.warehouseId) {
                const wh = await Warehouse.findByPk(loc.warehouseId);
                if (wh && wh.code) {
                    whCode = wh.code;
                }
            }
        } catch (err) {
            console.error('Error resolving warehouse code for reference:', err);
        }
    }

    const opCode = TYPE_CODE[picking.type] || 'INT';

    // Count existing pickings of the same type to get the next sequence number
    const count = await StockPicking.count({ where: { type: picking.type } });
    const seq = String(count + 1).padStart(4, '0');

    picking.reference = `${whCode}/${opCode}/${seq}`;
});

module.exports = StockPicking;
