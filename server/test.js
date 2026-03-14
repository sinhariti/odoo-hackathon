const { StockPicking, Location, Warehouse } = require('./src/models');

async function test() {
    console.log('Fetching all pickings...');
    const pickings = await StockPicking.findAll();
    for (const p of pickings) {
        console.log(`Picking ${p.id} reference: ${p.reference}`);
    }
    
    console.log('Testing Location -> Warehouse include...');
    const loc = await Location.findByPk(1, {
        include: [{ model: Warehouse, as: 'warehouse' }]
    });
    console.log('Location 1 warehouse code:', loc?.warehouse?.code);
}

test().catch(console.error).finally(() => process.exit());
