const database = require("../database/config");

function autenticar(email, senha) {
    const instrucaoSql = `
        SELECT id, nome, email, id_empresa, id_papel, nome_papel, tipo_papel 
        FROM vw_info_user 
        WHERE email = ? AND senha = ?;
    `;

    return database.executar(instrucaoSql, [email, senha]);
}

function buscarPorEmail(email) {
    const instrucaoSql = `
        SELECT id FROM vw_info_user  WHERE email = ?;
    `;

    return database.executar(instrucaoSql, [email]);
}

function validarPapelFuncionario(idPapel) {
    const instrucaoSql = `
    SELECT id_papeis
        FROM vw_papeis
        WHERE id_papeis = 2 AND tipo = 'FUNCIONARIO';
    `;

    return database.executar(instrucaoSql, [idPapel]);
}

function validarResponsavel(idResponsavel, idEmpresa) {
    const instrucaoSql = `
        SELECT id
        FROM vw_info_user
        INNER JOIN vw_papeis ON vw_papeis.id_papeis = vw_info_user.id_papel
        WHERE vw_info_user.id = ?
            AND vw_info_user.id_empresa = ?
            AND vw_papeis.tipo = 'GESTOR';
    `;

    return database.executar(instrucaoSql, [idResponsavel, idEmpresa]);
}

function cadastrar(nome, email, senha, idPapel, idResponsavel, idEmpresa, passKey) {
    const instrucaoSql = `
        INSERT INTO usuarios (nome, email, senha, papel, cadastrado, empresa, passkey)
        VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    return database.executar(instrucaoSql, [
        nome,
        email,
        senha,
        idPapel,
        idResponsavel,
        idEmpresa,
        passKey
    ]);
}

module.exports = {
    autenticar,
    buscarPorEmail,
    validarPapelFuncionario,
    validarResponsavel,
    cadastrar
};
