const { Resend } = require("resend")
const dotenv = require("dotenv")

dotenv.config()

function enviarConvite(nome, email, token) {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const enderecoApp = process.env.APP_URL || `http://${process.env.APP_HOST || "localhost"}:${process.env.APP_PORT || 3333}`
    const linkAtivacao = new URL("/pages/ativar-conta.html", enderecoApp)
    linkAtivacao.searchParams.set("token", token)
    const nomeSeguro = nome.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")

    return resend.emails.send({
        from: process.env.RESEND_FROM || "onboarding@resend.dev",
        to: email,
        subject: "Convite para acessar a CoreTrace",

        html: `
            <h2>Olá ${nomeSeguro}!</h2>
            <p>Você foi convidado para acessar o sistema de monitoramento CoreTrace.</p>
            <a href="${linkAtivacao}">Ativar minha conta na CoreTrace</a>
        `
    }).then(function (resultado) {
        if (resultado.error) {
            throw new Error(resultado.error.message)
        }

        return resultado.data
    })
}

module.exports = { enviarConvite }
