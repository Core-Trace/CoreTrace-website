const database = require("../database/config");

function autenticar(email, senha) {
    const instrucaoSql = `
        SELECT
            usuarios.id_usuarios AS id,
            usuarios.nome,
            usuarios.email,
            usuarios.empresa AS id_empresa,
            papeis.id_papeis AS id_papel,
            papeis.nome AS nome_papel,
            papeis.tipo AS tipo_papel
        FROM usuarios
        INNER JOIN papeis ON papeis.id_papeis = usuarios.papel
        WHERE usuarios.email = ? AND usuarios.senha = ?;
    `;

    return database.executar(instrucaoSql, [email, senha]);
}

function buscarPorEmail(email) {
    const instrucaoSql = `
        SELECT id_usuarios
        FROM usuarios
        WHERE email = ?;
    `;

    return database.executar(instrucaoSql, [email]);
}

function validarPapelFuncionario(idPapel) {
    const instrucaoSql = `
        SELECT id_papeis
        FROM papeis
        WHERE id_papeis = ? AND tipo = 'FUNCIONARIO';
    `;

    return database.executar(instrucaoSql, [idPapel]);
}

function validarResponsavel(idResponsavel, idEmpresa) {
    const instrucaoSql = `
        SELECT usuarios.id_usuarios
        FROM usuarios
        INNER JOIN papeis ON papeis.id_papeis = usuarios.papel
        WHERE usuarios.id_usuarios = ?
            AND usuarios.empresa = ?
            AND papeis.tipo = 'GESTOR';
    `;

    return database.executar(instrucaoSql, [idResponsavel, idEmpresa]);
}

function cadastrar(nome, email, senha, idPapel, idResponsavel, idEmpresa) {
    const instrucaoSql = `
        INSERT INTO usuarios (nome, email, senha, papel, cadastrado, empresa)
        VALUES (?, ?, ?, ?, ?, ?);
    `;

    return database.executar(instrucaoSql, [
        nome,
        email,
        senha,
        idPapel,
        idResponsavel,
        idEmpresa
    ]);
}

module.exports = {
    autenticar,
    buscarPorEmail,
    validarPapelFuncionario,
    validarResponsavel,
    cadastrar
};
