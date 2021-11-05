const assert = require('assert');
const Factory = require('../fruitBasketFactory');

const { Pool } = require('pg');
    
const connectionString = process.env.DATABASE_URL || 'postgres://postgres@localhost/fruitbasket';

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
});

const factory = Factory(pool);

describe('Fruit Basket testing:', () => {
    beforeEach(async() => {
        await pool.query('TRUNCATE TABLE fruit_basket');
    })

    it('Should insert new fruit basket', async() => {
        await factory.createBasket('Apple', 15, 3);

        const out = await (await pool.query("SELECT * FROM fruit_basket")).rows[0];

        assert.equal(out.fruit, 'Apple');
        assert.equal(out.quantity, 15);
        assert.equal(out.unit_price, 3);
    })

    it('Should return all apple fruit baskets', async() => {
        await factory.createBasket('Apple', 15, 3);
        await factory.createBasket('Pear', 20, 2);
        await factory.createBasket('Apple', 25, 2);

        const out = await factory.findFruit('Apple');

        assert.equal(out[0].fruit, 'Apple');
        assert.equal(out[0].quantity, 15);
        assert.equal(out[0].unit_price, 3);

        assert.equal(out[1].fruit, 'Apple');
        assert.equal(out[1].quantity, 25);
        assert.equal(out[1].unit_price, 2);
    })

    it("Should update a specific baskets' quantity", async() => {
        await factory.createBasket('Apple', 15, 3);

        await factory.updateBasket('Apple', 15, 25);
        const out = await factory.findFruit('Apple');

        assert.equal(out[0].fruit, 'Apple');
        assert.equal(out[0].quantity, 25);
        assert.equal(out[0].unit_price, 3);
    })

    it("Should total a specific baskets' price", async() => {
        await factory.createBasket('Apple', 15, 3);

        assert.equal(await factory.totalBasket('Apple', 15, 3), 45);
    })

    it('Should display the total of all baskets of a given fruit', async() => {
        await factory.createBasket('Apple', 15, 3);
        await factory.createBasket('Apple', 20, 2);
        await factory.createBasket('Apple', 20, 3);

        assert.equal(await factory.sumTotalBasket('Apple'), 145);
    })
})