const crypto = require("crypto");
const usuarioModel = require("../models/usuarioModel");
const emailService = require("../services/emailService");

function criarConvite(req, res) {
    const dados = req.body || {};
    const nome = dados.nome;
    const email = dados.email;
    const cpf = dados.cpf || null;
    const telefone = dados.telefone || null;
    const empresa = Number(dados.empresa);
    const nivelAcesso = Number(dados.nivelAcesso);

    if (typeof nome !== "string" || nome.trim() === "" || nome.trim().length > 45) {
        return res.status(400).json({ mensagem: "Informe um nome com até 45 caracteres." });
    }

    if (typeof email !== "string" || email.trim().length > 45 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return res.status(400).json({ mensagem: "Informe um email válido com até 45 caracteres." });
    }

    if (cpf !== null && (typeof cpf !== "string" || !/^\d{11}$/.test(cpf))) {
        return res.status(400).json({ mensagem: "Informe o CPF com 11 números, sem pontuação." });
    }

    if (telefone !== null && (typeof telefone !== "string" || telefone.length > 45)) {
        return res.status(400).json({ mensagem: "Informe um telefone com até 45 caracteres." });
    }

    if (!Number.isInteger(empresa) || empresa <= 0 || !Number.isInteger(nivelAcesso) || nivelAcesso <= 0) {
        return res.status(400).json({ mensagem: "Informe os IDs da empresa e do nível de acesso." });
    }

    if (!process.env.RESEND_API_KEY) {
        return res.status(503).json({ mensagem: "O envio de email não está configurado no servidor." });
    }

    const token = crypto.randomBytes(32).toString("hex");

    return usuarioModel.criarUser(nome.trim(), email.trim(), token, cpf, telefone, empresa, nivelAcesso)
        .then(function (resultado) {
            return Promise.resolve()
                .then(function () {
                    return emailService.enviarConvite(nome.trim(), email.trim(), token);
                })
                .then(function () {
                    return res.status(201).json({
                        id_usuario: resultado.insertId,
                        mensagem: "Usuário cadastrado! Convite enviado por email para definir a senha."
                    });
                })
                .catch(function (erro) {
                    console.error("Erro ao enviar convite:", erro.message);

                    return usuarioModel.removerConvite(resultado.insertId, token)
                        .then(function () {
                            return res.status(502).json({
                                mensagem: "Não foi possível enviar o email. O cadastro foi desfeito; verifique o Resend e tente novamente."
                            });
                        });
                });
        })
        .catch(function (erro) {
            if (erro.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ mensagem: "Já existe um usuário com esse email ou CPF." });
            }

            if (erro.code === "ER_NO_REFERENCED_ROW_2") {
                return res.status(400).json({ mensagem: "A empresa ou o nível de acesso não existe." });
            }

            console.error("Erro ao cadastrar convite:", erro.message);
            return res.status(500).json({ mensagem: "Houve um erro ao cadastrar o convite." });
        });
}

module.exports = { criarConvite };
