const database = require("../database/config");

function ativarAgente(tokenInstalacao, hostname) {
    var instrucaoSql = `
        SELECT
            s.id,
            s.hostname,
            s.token_servidor,
            s.endereco_mac
        FROM servidor s
        JOIN empresa e
            ON s.fk_empresa = e.id
        WHERE e.token_instalacao = '${tokenInstalacao}'
          AND s.hostname = '${hostname}';
    `;

    return database.executar(instrucaoSql);
}

function salvarMac(idServidor, enderecoMac) {
    var instrucaoSql = `
        UPDATE servidor
        SET endereco_mac = '${enderecoMac}'
        WHERE id = ${idServidor};
    `;

    return database.executar(instrucaoSql);
}

module.exports = {
    ativarAgente,
    salvarMac
};