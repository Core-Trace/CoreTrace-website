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

async function criarUser(nome, email, token) {
// cria o usuário quando você manda o convite
    const instrucao = `
        INSERT INTO usuario (nome, email, token, status)
        VALUES (?, ?, ?, 'PENDENTE');
    `

    return database.executar(instrucao, [nome, email, token])
}

async function buscarUsuarioPorToken(token) {
// procura quem é o dono daquele token
    const instrucao = `
        SELECT * FROM usuario
        WHERE token = ?;
    `

    return database.executar(instrucao, [token])
}

async function ativarUsuario(idUsuario, senha) {

    const instrucao = `
        UPDATE usuario
        SET senha = ?, status = 'ATIVO'
        WHERE idUsuario = ?;
    `

    return database.executar(instrucao, [senha, idUsuario])
}

module.exports = {
    cadastrar,
    autenticar,
    criarUser,
    buscarUsuarioPorToken,
    ativarUsuario
}
