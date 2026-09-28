const crypto = require("crypto")
const usuarioModel = require("../models/usuarioModel")
const emailService = require("../services/emailService")

async function criarConvite(req, res) {

    const nome = req.body.nome
    const email = req.body.email

    const token = crypto.randomBytes(32).toString("hex")

    await usuarioModel.criarUser(nome, email, token)

    await emailService.enviarConvite(nome, email, token)

    res.json({
        mensagem: "Convite enviado com sucesso"
    })
}

module.exports = {
    criarConvite
}