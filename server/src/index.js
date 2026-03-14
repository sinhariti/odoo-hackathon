const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/warehouses', require('./routes/warehouses'));
app.use('/api/locations', require('./routes/locations'));
app.use('/api/products', require('./routes/products'));
app.use('/api/stock-quants', require('./routes/stockQuants'));
app.use('/api/stock-moves', require('./routes/stockMoves'));
app.use('/api/receipts', require('./routes/receipts'));
app.use('/api/deliveries', require('./routes/deliveries'));
app.use('/api/transfers', require('./routes/transfers'));
app.use('/api/adjustments', require('./routes/adjustments'));
app.use('/api/reordering-rules', require('./routes/reorderingRules'));
app.use('/api/dashboard', require('./routes/dashboard'));


// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected');

        await sequelize.sync({ alter: true });
        console.log('✅ Models synced');

        // Backfill references for existing pickings that don't have one
        const { StockPicking, Location, Warehouse } = require('./models');
        const pickingsWithoutRef = await StockPicking.findAll({ where: { reference: null }, order: [['id', 'ASC']] });
        if (pickingsWithoutRef.length) {
            const TYPE_CODE = { receipt: 'IN', delivery: 'OUT', internal: 'INT' };
            for (const picking of pickingsWithoutRef) {
                let whCode = 'WH';
                const locId = picking.destLocationId || picking.srcLocationId;
                if (locId) {
                    const loc = await Location.findByPk(locId, {
                        include: [{ model: Warehouse, as: 'warehouse', attributes: ['code'] }],
                    });
                    if (loc?.warehouse?.code) whCode = loc.warehouse.code;
                }
                const opCode = TYPE_CODE[picking.type] || 'INT';
                const count = await StockPicking.count({ where: { type: picking.type, reference: { [require('sequelize').Op.ne]: null } } });
                const seq = String(count + 1).padStart(4, '0');
                await picking.update({ reference: `${whCode}/${opCode}/${seq}` });
            }
            console.log(`✅ Backfilled references for ${pickingsWithoutRef.length} pickings`);
        }

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Unable to start server:', err);
        process.exit(1);
    }
}

start();
