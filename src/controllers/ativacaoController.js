const usuarioModel = require("../models/usuarioModel");

function ativar(req, res) {
    const token = req.query.token;

    if (typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token)) {
        return res.status(400).json({ mensagem: "Link de ativação inválido." });
    }

    return usuarioModel.buscarUsuarioPorToken(token)
        .then(function (usuarios) {
            if (usuarios.length === 0) {
                return res.status(404).json({ mensagem: "Convite não encontrado ou já utilizado." });
            }

            return res.json({ usuario: usuarios[0] });
        })
        .catch(function (erro) {
            console.error("Erro ao buscar convite:", erro.message);
            return res.status(500).json({ mensagem: "Não foi possível buscar o convite." });
        });
}

function concluirAtivacao(req, res) {
    const dados = req.body || {};
    const token = dados.token;
    const senha = dados.senha;

    if (typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token)) {
        return res.status(400).json({ mensagem: "Link de ativação inválido." });
    }

    if (typeof senha !== "string" || senha.trim() === "" || senha.length < 6 || senha.length > 45) {
        return res.status(400).json({ mensagem: "A senha deve ter entre 6 e 45 caracteres." });
    }

    return usuarioModel.ativarUsuario(token, senha)
        .then(function (resultado) {
            if (resultado.affectedRows === 0) {
                return res.status(404).json({ mensagem: "Convite não encontrado ou já utilizado." });
            }

            return res.json({ mensagem: "Conta ativada com sucesso!" });
        })
        .catch(function (erro) {
            console.error("Erro ao ativar conta:", erro.message);
            return res.status(500).json({ mensagem: "Não foi possível ativar a conta." });
        });
}

module.exports = { ativar, concluirAtivacao };
