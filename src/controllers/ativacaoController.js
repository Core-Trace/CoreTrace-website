const usuarioModel = require("../models/usuarioModel")

// busca usuario por token
async function ativar(req, res) {

    const token = req.query.token
    const usuario = await usuarioModel.buscarUsuarioPorToken(token)

   // Retorna os dados do usuário encontrado
    res.json({
        mensagem: "usuario encontrado",
        usuario: usuario[0]
    })
}

async function concluirAtivacao(req, res) {
    // Recebe o token e a senha enviados pelo HTML
    const token = req.body.token
    const senha = req.body.senha
 // Qual usuário possui esse token
    const usuarios = await usuarioModel.buscarUsuarioPorToken(token)

        // Pega o ID do usuário encontrado e grava sua senha,
    // alterando também o status para ATIVO
    await usuarioModel.ativarUsuario(usuarios[0].idUsuario, senha)

    // aqui a ativacao da conta é confirmada
    res.json({
        mensagem: "ativacao com sucesso"
    })
}

module.exports = {
    ativar,
    concluirAtivacao
}