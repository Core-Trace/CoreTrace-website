const database = require("../database/config")

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
    criarUser,
    buscarUsuarioPorToken,
    ativarUsuario
}