const database = require("../database/config");

function buscarTokens(idEmpresa, idPerfilServidor) {
    const instrucaoSql = `
        SELECT e.token_instalacao, p.token_perfil_servidor
        FROM empresa e
        INNER JOIN perfil_servidor p ON p.fk_empresa = e.id_empresa
        WHERE e.id_empresa = ? AND p.id_perfil_servidor = ?;
    `;

    return database.executar(instrucaoSql, [idEmpresa, idPerfilServidor]);
}

module.exports = { buscarTokens };
