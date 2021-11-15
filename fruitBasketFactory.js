module.exports = function fruitBasket(pool) {

    async function createBasket(fruit, qty, price) {
        await pool.query('INSERT INTO fruit_basket (fruit, quantity, unit_price) VALUES ($1, $2, $3)', [fruit, qty, price]);
    }

    async function findFruit(fruit) {
        return await (await pool.query('SELECT * FROM fruit_basket WHERE fruit = $1', [fruit])).rows;
    }

    async function updateBasket(fruit, oldQty, newQty) {
        await pool.query('UPDATE fruit_basket SET quantity = $1 WHERE fruit = $2 AND quantity = $3', [newQty, fruit, oldQty]);
    }

    async function totalBasket(fruit, qty, price) {
        const basket = await ( await pool.query('SELECT (quantity * unit_price) AS total FROM fruit_basket WHERE fruit = $1 AND quantity = $2 AND unit_price = $3', [fruit, qty, price])).rows[0];
        return basket.total;
    }

    async function sumTotalBasket(fruit) {
        const total = await ( await pool.query('SELECT sum(quantity * unit_price) FROM fruit_basket WHERE fruit = $1', [fruit])).rows;git 
        return total[0].sum;
    }

    return {
        createBasket,
        findFruit,
        updateBasket,
        totalBasket,
        sumTotalBasket,
    }
}