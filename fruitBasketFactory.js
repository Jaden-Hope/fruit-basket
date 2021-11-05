function fruitBasket() {
    const { Pool } = require('pg');
    
    const connectionString = 'postgres://jaden:mypass@fruitBasket';

    const pool = new Pool({
        connectionString,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    pool.connect();

    function createBasket(fruit, quantity, price) {
        pool.query('INSERT INTO fruit_basket (fruit, quantity, unit_price) VALUES ($1, $2, $3)', [fruit, quantity, price]);
    }

    return {
        createBasket,
    }
}