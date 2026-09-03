const loginModel = require("../models/loginModel");

function autenticar(req, res) {
    const email = req.body.emailServer;
    const senha = req.body.senhaServer;

    if (typeof email !== "string" || email.trim() === "") {
        return res.status(400).send("Seu email está indefinido!");
    }

    if (typeof senha !== "string" || senha === "") {
        return res.status(400).send("Sua senha está indefinida!");
    }

    return loginModel.autenticar(email.trim(), senha)
        .then(function (resultadoAutenticar) {
            if (resultadoAutenticar.length === 1) {
                const usuario = resultadoAutenticar[0];

                return res.json({
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    empresa: usuario.id_empresa,
                    papel: {
                        id: usuario.id_papel,
                        nome: usuario.nome_papel,
                        tipo: usuario.tipo_papel
                    }
                });
            }

            if (resultadoAutenticar.length === 0) {
                return res.status(403).send("Email e/ou senha inválido(s)");
            }

            return res.status(403).send("Mais de um usuário com o mesmo login e senha!");
        })
        .catch(function (erro) {
            console.error("Erro ao realizar o login:", erro);
            return res.status(500).send("Houve um erro ao realizar o login.");
        });
}

function cadastrar(req, res) {
    const nome = req.body.nomeServer;
    const email = req.body.emailServer;
    const senha = req.body.senhaServer;
    const idPapel = Number(req.body.papelServer);
    const idResponsavel = Number(req.body.cadastradoServer);
    const idEmpresa = Number(req.body.empresaServer);

    if (typeof nome !== "string" || nome.trim() === "") {
        return res.status(400).send("Seu nome está indefinido!");
    }

    if (typeof email !== "string" || email.trim() === "") {
        return res.status(400).send("Seu email está indefinido!");
    }

    if (typeof senha !== "string" || senha === "") {
        return res.status(400).send("Sua senha está indefinida!");
    }

    if (!Number.isInteger(idPapel) || idPapel <= 0) {
        return res.status(400).send("O papel do funcionário está inválido!");
    }

    if (!Number.isInteger(idResponsavel) || idResponsavel <= 0) {
        return res.status(400).send("O usuário responsável pelo cadastro está inválido!");
    }

    if (!Number.isInteger(idEmpresa) || idEmpresa <= 0) {
        return res.status(400).send("A empresa está inválida!");
    }

    return Promise.all([
        loginModel.buscarPorEmail(email.trim()),
        loginModel.validarPapelFuncionario(idPapel),
        loginModel.validarResponsavel(idResponsavel, idEmpresa)
    ])
        .then(function (resultados) {
            const usuarioExistente = resultados[0];
            const papelFuncionario = resultados[1];
            const responsavelValido = resultados[2];

            if (usuarioExistente.length > 0) {
                return res.status(409).send("Já existe um usuário cadastrado com esse email.");
            }

            if (papelFuncionario.length === 0) {
                return res.status(400).send("O papel informado não pertence a um funcionário.");
            }

            if (responsavelValido.length === 0) {
                return res.status(403).send("O responsável não pode cadastrar funcionários nessa empresa.");
            }

            return loginModel.cadastrar(
                nome.trim(),
                email.trim(),
                senha,
                idPapel,
                idResponsavel,
                idEmpresa
            ).then(function (resultadoCadastro) {
                return res.status(201).json({
                    id: resultadoCadastro.insertId,
                    nome: nome.trim(),
                    email: email.trim(),
                    papel: idPapel,
                    empresa: idEmpresa
                });
            });
        })
        .catch(function (erro) {
            console.error("Erro ao cadastrar o funcionário:", erro);

            if (erro.code === "ER_DUP_ENTRY") {
                return res.status(409).send("Já existe um usuário cadastrado com esse email.");
            }

            return res.status(500).send("Houve um erro ao cadastrar o funcionário.");
        });
}

function validarPasskey(req, res) {
    const idUsuario = req.body.idUsuarioServer;
    const passkey = req.body.passkeyServer;

    if (!idUsuario) {
        return res.status(400).send("O ID está undefined!");
    }
    if (!passkey) {
        return res.status(400).send("A Passkey está undefined!");
    }

    loginModel.validarPasskey(idUsuario, passkey)
        .then(function (resultado) {
            if (resultado.length > 0) {
                return res.json(resultado[0]);
            } else {
                return res.status(403).send("Passkey inválida!");
            }
        })
        .catch(function (erro) {
            console.error("Erro na validação da passkey:", erro);
            return res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    autenticar,
    cadastrar,
    validarPasskey
};
