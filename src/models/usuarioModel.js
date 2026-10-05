const database = require("../database/config")

function cadastrar(nome, email, senha, cpf, telefone, empresa, nivelAcesso) {
    const instrucaoSql = `
        INSERT INTO usuario (nome, email, senha, cpf, telefone, fkEmpresa, fkNivel_acesso, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'ATIVO');
    `;

    return database.executar(instrucaoSql, [nome, email, senha, cpf, telefone, empresa, nivelAcesso]);
}

function autenticar(email, senha) {
    const instrucaoSql = `
        SELECT idusuario, nome, email, fkEmpresa, fkNivel_acesso, status
        FROM usuario
        WHERE email = ? AND senha = ? AND status = 'ATIVO';
    `;

    return database.executar(instrucaoSql, [email, senha]);
}

function criarUser(nome, email, token, cpf, telefone, empresa, nivelAcesso) {
    const instrucao = `
        INSERT INTO usuario (nome, email, token_acesso, cpf, telefone, fkEmpresa, fkNivel_acesso, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDENTE');
    `

    return database.executar(instrucao, [nome, email, token, cpf, telefone, empresa, nivelAcesso])
}

function buscarUsuarioPorToken(token) {
    const instrucao = `
        SELECT idusuario, nome, email
        FROM usuario
        WHERE token_acesso = ? AND status = 'PENDENTE';
    `

    return database.executar(instrucao, [token])
}

function ativarUsuario(token, senha) {
    const instrucao = `
        UPDATE usuario
        SET senha = ?, status = 'ATIVO', token_acesso = NULL
        WHERE token_acesso = ? AND status = 'PENDENTE';
    `

    return database.executar(instrucao, [senha, token])
}

function removerConvite(idUsuario, token) {
    const instrucao = `
        DELETE FROM usuario
        WHERE idusuario = ? AND token_acesso = ? AND status = 'PENDENTE';
    `

    return database.executar(instrucao, [idUsuario, token])
}

module.exports = {
    cadastrar,
    autenticar,
    criarUser,
    buscarUsuarioPorToken,
    ativarUsuario,
    removerConvite
}
