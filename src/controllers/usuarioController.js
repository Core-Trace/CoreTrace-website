const usuarioModel = require("../models/usuarioModel");

function cadastrar(req, res) {
    const dados = req.body || {};
    const nome = dados.nomeServer;
    const email = dados.emailServer;
    const senha = dados.senhaServer;
    const cpf = dados.cpfServer || null;
    const telefone = dados.telefoneServer || null;
    const empresa = Number(dados.empresaServer);
    const nivelAcesso = Number(dados.nivelAcessoServer);

    if (typeof nome !== "string" || nome.trim() === "" || nome.trim().length > 45) {
        return res.status(400).send("Informe um nome com até 45 caracteres.");
    }

    if (typeof email !== "string" || email.trim() === "" || email.trim().length > 45) {
        return res.status(400).send("Informe um email com até 45 caracteres.");
    }

    if (typeof senha !== "string" || senha.trim() === "" || senha.length > 45) {
        return res.status(400).send("Informe uma senha com até 45 caracteres.");
    }

    if (cpf !== null && (typeof cpf !== "string" || !/^\d{11}$/.test(cpf))) {
        return res.status(400).send("Informe o CPF com 11 números, sem pontuação.");
    }

    if (telefone !== null && (typeof telefone !== "string" || telefone.length > 45)) {
        return res.status(400).send("Informe um telefone com até 45 caracteres.");
    }

    if (!Number.isInteger(empresa) || empresa <= 0) {
        return res.status(400).send("Informe uma empresa válida.");
    }

    if (!Number.isInteger(nivelAcesso) || nivelAcesso <= 0) {
        return res.status(400).send("Informe um nível de acesso válido.");
    }

    return usuarioModel.cadastrar(nome.trim(), email.trim(), senha, cpf, telefone, empresa, nivelAcesso)
        .then(function (resultado) {
            return res.status(201).json({
                idusuario: resultado.insertId,
                nome: nome.trim(),
                email: email.trim(),
                fkEmpresa: empresa,
                fkNivel_acesso: nivelAcesso,
                status: "ATIVO"
            });
        })
        .catch(function (erro) {
            if (erro.code === "ER_DUP_ENTRY") {
                return res.status(409).send("Já existe um usuário com esse email ou CPF.");
            }

            if (erro.code === "ER_NO_REFERENCED_ROW_2") {
                return res.status(400).send("A empresa ou o nível de acesso não existe.");
            }

            console.error("Erro ao cadastrar usuário:", erro);
            return res.status(500).send("Houve um erro ao cadastrar o usuário.");
        });
}

function autenticar(req, res) {
    const dados = req.body || {};
    const email = dados.emailServer;
    const senha = dados.senhaServer;

    if (typeof email !== "string" || email.trim() === "") {
        return res.status(400).send("Informe o email.");
    }

    if (typeof senha !== "string" || senha.trim() === "") {
        return res.status(400).send("Informe a senha.");
    }

    return usuarioModel.autenticar(email.trim(), senha)
        .then(function (resultado) {
            if (resultado.length === 0) {
                return res.status(403).send("Email ou senha inválidos, ou usuário inativo.");
            }

            return res.json(resultado[0]);
        })
        .catch(function (erro) {
            console.error("Erro ao autenticar usuário:", erro);
            return res.status(500).send("Houve um erro ao autenticar o usuário.");
        });
}

module.exports = {
    cadastrar,
    autenticar
};
