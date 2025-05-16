const Pool = require("pg").Pool;

const pool = new Pool({
    host: "localhost",
    user: "root",
    password: "12345",
    port: 5432,
    database: "db_red_social"
});

module.exports = pool;
