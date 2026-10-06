const servidorModel = require("../models/servidorModel");

function ativarAgente(req, res) {
    const dados = req.body || {};
    const tokenInstalacao = dados.tokenInstalacaoServer;
    const tokenPerfilServidor = dados.tokenPerfilServidorServer;
    const mac = dados.enderecoMacServer;

    if (typeof tokenInstalacao !== "string" || tokenInstalacao.trim() === "" || tokenInstalacao.length > 255
        || typeof tokenPerfilServidor !== "string" || tokenPerfilServidor.trim() === "" || tokenPerfilServidor.length > 255) {
        return res.status(400).json({ mensagem: "Informe os tokens de instalação e do perfil de servidor." });
    }

    if (typeof mac !== "string" || !/^[0-9a-f]{2}([:-])[0-9a-f]{2}(\1[0-9a-f]{2}){4}$/i.test(mac.trim())) {
        return res.status(400).json({ mensagem: "Informe um endereço MAC válido." });
    }

    const enderecoMac = mac.trim().replace(/-/g, ":").toUpperCase();

    if (enderecoMac === "00:00:00:00:00:00") {
        return res.status(400).json({ mensagem: "Informe um endereço MAC válido." });
    }

    function responderAtivacao(idServidor) {
        return res.status(200).json({
            mensagem: "Agente ativado com sucesso.",
            id_servidor: idServidor
        });
    }

    return servidorModel.buscarPerfil(tokenInstalacao.trim(), tokenPerfilServidor.trim())
        .then(function (perfis) {
            if (perfis.length === 0) {
                return res.status(403).json({ mensagem: "Tokens inválidos ou perfil não vinculado à empresa." });
            }

            const idPerfilServidor = perfis[0].id_perfil_servidor;

            return servidorModel.buscarPorMac(enderecoMac)
                .then(function (servidores) {
                    if (servidores.length > 0) {
                        const servidor = servidores[0];

                        if (servidor.fk_perfil_servidor !== idPerfilServidor) {
                            return res.status(409).json({ mensagem: "Este MAC já está cadastrado em outro perfil de servidor." });
                        }

                        return servidorModel.ativar(servidor.id_servidor, idPerfilServidor)
                            .then(function () {
                                return responderAtivacao(servidor.id_servidor);
                            });
                    }

                    return servidorModel.cadastrar(enderecoMac, idPerfilServidor)
                        .then(function (resultado) {
                            return responderAtivacao(resultado.insertId);
                        });
                });
        })
        .catch(function (erro) {
            if (erro.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ mensagem: "Este MAC acabou de ser cadastrado. Tente ativar novamente." });
            }

            console.error("Erro ao ativar agente:", erro.message);
            return res.status(500).json({ mensagem: "Não foi possível ativar o agente." });
        });
}

function listarPerfis(req, res) {
    const idEmpresa = Number(req.query.empresa);

    if (typeof req.query.empresa !== "string" || !Number.isSafeInteger(idEmpresa) || idEmpresa <= 0) {
        return res.status(400).json({ mensagem: "Informe uma empresa válida para consultar os perfis." });
    }

    return servidorModel.listarPerfisPorEmpresa(idEmpresa)
        .then(function (perfis) {
            return res.json(perfis);
        })
        .catch(function (erro) {
            console.error("Erro ao listar perfis de servidor:", erro.message);
            return res.status(500).json({ mensagem: "Não foi possível carregar os perfis de servidor. Tente novamente." });
        });
}

module.exports = { ativarAgente, listarPerfis };
