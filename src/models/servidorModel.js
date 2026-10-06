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

function listarPerfisPorEmpresa(idEmpresa) {
    const instrucaoSql = `
        SELECT p.id_perfil_servidor, p.nome, p.descricao,
               COUNT(s.id_servidor) AS total_servidores
        FROM perfil_servidor p
        LEFT JOIN servidores s ON s.fk_perfil_servidor = p.id_perfil_servidor
        WHERE p.fk_empresa = ?
        GROUP BY p.id_perfil_servidor, p.nome, p.descricao
        ORDER BY p.nome ASC, p.id_perfil_servidor ASC;
    `;

    return database.executar(instrucaoSql, [idEmpresa]);
}

module.exports = { buscarPerfil, buscarPorMac, cadastrar, ativar, listarPerfisPorEmpresa };
