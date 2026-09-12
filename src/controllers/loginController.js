const loginModel = require("../models/loginModel");

function autenticar(req, res) {
    const email = req.body.emailServer;
    const senha = req.body.senhaServer;
    const passKey = req.body.passKeyServer;

    if (typeof email !== "string" || email.trim() === "") {
        return res.status(400).send("Seu email está indefinido!");
    }

    if (typeof senha !== "string" || senha === "") {
        return res.status(400).send("Sua senha está indefinida!");
    }
    if(typeof passKey !== "string" || passKey === "") {
        return res.status(400).send("Sua passkey está indefinida!");
    }

    return loginModel.autenticar(email.trim(), senha, passKey)
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
    const passKey = gerarPassKey()

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

    if(passKey.length != 16){
        return res.status(400).send("A passKey está incorreta!")
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
                idEmpresa,
                passKey
            ).then(function (resultadoCadastro) {
                return res.status(201).json({
                    id: resultadoCadastro.insertId,
                    nome: nome.trim(),
                    email: email.trim(),
                    papel: idPapel,
                    empresa: idEmpresa,
                    chavePasse: passKey
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

function gerarPassKey() {
    console.log("PassKey sendo gerada");
    let passKey = "";
    const charsets = "0123456789AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz";
    for (let i = 0; i < 16; i++) {
        let randNum = Math.floor(Math.random() * (charsets.length));
        passKey += charsets[randNum];
    }
    console.log(passKey);
    return passKey;
}

function getSectors(req,res){
    let empresaId = req.body.idEmpresa
    if(!empresaId){
        return res.status(400).send("A empresa está inválida!");
    }
    else{
        loginModel.getSectors(empresaId).then(function (resultado) {
                res.json(resultado);
            })
            .catch(function (erro) {
                console.log(erro);
                console.log("Houve um erro ao puxar servidores! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    } 
        
}
function getSectorsUser(req,res){
    let usuarioId = req.params.id
    if(!usuarioId){
        return res.status(400).send("O usuário está inválido!");
    }
    else{
        loginModel.getSectorsUser(usuarioId).then(function (resultado) {
                res.json(resultado);    
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("Houve um erro ao puxar servidores! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
    }
}

function getMachines(req,res){
    const setor = req.body.setor
    if(setor<=0 || setor == null){
        return res.status(400).send("O setor está inválido!");
    }
    else{loginModel.getMachines(setor).then(function (resultado) {
                res.json(resultado);
            })
            .catch(function (erro) {
                console.log(erro);
                console.log("Houve um erro ao puxar máquinas! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function criarAcessos(req, res) {
    const usuario = Number(req.body.usuario);
    const concedidoPor = Number(req.body.concedidoPor);
    const acessos = req.body.acessos; // [{ servidor, maquina }, ...]

    if (!Number.isInteger(usuario) || usuario <= 0) {
        return res.status(400).send("O usuário informado é inválido!");
    }

    if (!Number.isInteger(concedidoPor) || concedidoPor <= 0) {
        return res.status(400).send("O responsável pela concessão é inválido!");
    }

    if (!Array.isArray(acessos) || acessos.length === 0) {
        return res.status(400).send("É necessário informar ao menos um acesso (servidor e máquina).");
    }

    const acessoInvalido = acessos.some(function (acesso) {
        return !Number.isInteger(Number(acesso.servidor)) || !Number.isInteger(Number(acesso.maquina))
            || Number(acesso.servidor) <= 0 || Number(acesso.maquina) <= 0;
    });

    if (acessoInvalido) {
        return res.status(400).send("Todo acesso precisa de um servidor e uma máquina válidos.");
    }

    return loginModel.criarAcessosEmLote(usuario, concedidoPor, acessos)
        .then(function () {
            return res.status(201).json({ mensagem: "Acessos cadastrados com sucesso!" });
        })
        .catch(function (erro) {
            console.error("Erro ao criar acessos:", erro);

            if (erro.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ mensagem: "Um ou mais acessos já existem para esse usuário." });
            }

            return res.status(500).json({ mensagem: "Houve um erro ao cadastrar os acessos." });
        });
}

function listarAcessos(req, res) {
    const usuario = Number(req.params.usuario);

    if (!Number.isInteger(usuario) || usuario <= 0) {
        return res.status(400).send("O usuário informado é inválido!");
    }

    return loginModel.listarAcessosPorUsuario(usuario)
        .then(function (acessos) {
            return res.json(acessos);
        })
        .catch(function (erro) {
            console.error("Erro ao listar acessos:", erro);
            return res.status(500).send("Houve um erro ao listar os acessos.");
        });
}

function revogarAcesso(req, res) {
    const usuario = Number(req.body.usuario);
    const servidor = Number(req.body.servidor);
    const maquina = Number(req.body.maquina);

    if (!Number.isInteger(usuario) || !Number.isInteger(servidor) || !Number.isInteger(maquina)
        || usuario <= 0 || servidor <= 0 || maquina <= 0) {
        return res.status(400).send("Usuário, servidor e máquina precisam ser válidos.");
    }

    return loginModel.revogarAcesso(usuario, servidor, maquina)
        .then(function (resultado) {
            if (resultado.affectedRows === 0) {
                return res.status(404).send("Acesso não encontrado ou já revogado.");
            }
            return res.status(200).send("Acesso revogado com sucesso!");
        })
        .catch(function (erro) {
            console.error("Erro ao revogar acesso:", erro);
            return res.status(500).send("Houve um erro ao revogar o acesso.");
        });
}

module.exports = {
    autenticar,
    cadastrar,
    getSectors,
    getMachines,
    criarAcessos,
    listarAcessos,
    revogarAcesso,
    getSectorsUser
};
