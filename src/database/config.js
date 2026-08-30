const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    waitForConnections: true,
    connectionLimit: 10
});

async function executar(instrucaoSql, parametros = []) {
    const [resultado] = await pool.execute(instrucaoSql, parametros);
    return resultado;
}

module.exports = {
    executar
};
