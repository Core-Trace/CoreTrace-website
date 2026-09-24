const serverModel = require("../models/servidorModel");

function ativarAgente(req, res) {
    const tokenInstalacao = req.body.tokenInstalacaoServer;
    const hostname = req.body.hostnameServer;
    const enderecoMac = req.body.enderecoMacServer;

    if (tokenInstalacao == undefined) {
        return res.status(400).send(
            "Token de instalação está undefined"
        );
    }

    if (hostname == undefined) {
        return res.status(400).send(
            "Hostname está undefined"
        );
    }

    if (enderecoMac == undefined) {
        return res.status(400).send(
            "Endereço MAC está undefined"
        );
    }

    serverModel.ativarAgente(tokenInstalacao, hostname)
        .then(function (resultado) {

            if (resultado.length == 0) {
                return res.status(404).send(
                    "Servidor não encontrado para essa empresa"
                );
            }

            if (resultado.length > 1) {
                return res.status(409).send(
                    "Existe mais de um servidor com esse hostname"
                );
            }

            const servidor = resultado[0];

            if (servidor.endereco_mac == null) {

                serverModel.salvarMac(
                    servidor.id,
                    enderecoMac
                ).then(function () {
                    return res.json({
                        mensagem: "Agente ativado com sucesso",
                        tokenServidor: servidor.token_servidor
                    });

                }).catch(function (erro) {
                    return res.status(500).json(
                        erro.sqlMessage
                    );
                });

            } else if (
                servidor.endereco_mac.toUpperCase() ===
                enderecoMac.toUpperCase()
            ) {

                return res.json({
                    mensagem: "Agente já estava ativado nesta máquina",
                    tokenServidor: servidor.token_servidor
                });

            } else {

                return res.status(409).send(
                    "Este servidor já está vinculado a outra máquina"
                );
            }

        })
        .catch(function (erro) {
            return res.status(500).json(
                erro.sqlMessage
            );
        });
}


module.exports = {
    ativarAgente,
};
