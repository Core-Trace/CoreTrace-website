const database = require("../database/config");

function buscarPerfil(tokenInstalacao, tokenPerfilServidor) {
    const instrucaoSql = `
        SELECT p.id_perfil_servidor
        FROM perfil_servidor p
        INNER JOIN empresa e ON e.id_empresa = p.fk_empresa
        WHERE e.token_instalacao = ? AND p.token_perfil_servidor = ?;
    `;

    return database.executar(instrucaoSql, [tokenInstalacao, tokenPerfilServidor]);
}

function buscarPorMac(enderecoMac) {
    const instrucaoSql = `
        SELECT id_servidor, fk_perfil_servidor
        FROM servidores
        WHERE endereco_mac = ?;
    `;

    return database.executar(instrucaoSql, [enderecoMac]);
}

function cadastrar(enderecoMac, idPerfilServidor) {
    const instrucaoSql = `
        INSERT INTO servidores (nome, status, endereco_mac, fk_perfil_servidor)
        VALUES (?, 'ATIVO', ?, ?);
    `;

    return database.executar(instrucaoSql, [`Servidor ${enderecoMac}`, enderecoMac, idPerfilServidor]);
}

function ativar(idServidor, idPerfilServidor) {
    const instrucaoSql = `
        UPDATE servidores
        SET status = 'ATIVO'
        WHERE id_servidor = ? AND fk_perfil_servidor = ?;
    `;

    return database.executar(instrucaoSql, [idServidor, idPerfilServidor]);
}

module.exports = { buscarPerfil, buscarPorMac, cadastrar, ativar };
