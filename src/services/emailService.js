const { Resend } = require("resend")
const dotenv = require("dotenv")

dotenv.config()

async function enviarConvite(nome, email, token) {
    const resend = new Resend(process.env.Resend)

    const linkAtivacao = `http://localhost:3333/pages/ativar-conta.html?token=${token}`

    const data = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "convite para acessar",

        html: `
            <h2>Olá ${nome}!</h2>
            <p>Você foi convidado para acessar o sistema de monitoramento CoreTrace.</p>
            <a href="${linkAtivacao}">Ativar minha conta na CoreTrace</a>
        `
    })
}

module.exports = { enviarConvite }
