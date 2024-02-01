const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'kfovgsqs',
    password: 'eFcjrhZbAR7-pQsxqIijBx4y0fRUnZts',
    host: 'kandula.db.elephantsql.com',
    port: 5432,
    database: 'kfovgsqs',
});

module.exports = pool;
