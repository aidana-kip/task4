const { Pool } = require('pg');

console.log('Database connection: ');
console.log('PG HOST: ' + process.env.PG_HOST);
console.log('PG PORT: ' + process.env.PG_PORT);
console.log('PG PASSWORD: ' + process.env.PG_PASSWORD);

const pool = new Pool({
    user: 'postgres',
    password: process.env.PG_PASSWORD || '',
    host: process.env.PG_HOST || 'localhost',
    port: process.env.PG_PORT || 5433,
    database: 'task4',
    max: 10,
    min: 2,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = { pool }