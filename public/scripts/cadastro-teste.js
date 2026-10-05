const cadastroForm = document.getElementById("cadastroForm");
const cadastrarButton = document.getElementById("cadastrarButton");
const mensagem = document.getElementById("mensagem");

cadastroForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (cadastrarButton.disabled) return;

    cadastrarButton.disabled = true;
    mensagem.textContent = "Cadastrando e enviando o convite...";

    return fetch("/convites/criarConvite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nome: document.getElementById("nome").value.trim(),
            email: document.getElementById("email").value.trim(),
            cpf: document.getElementById("cpf").value.trim(),
            telefone: document.getElementById("telefone").value.trim(),
            empresa: Number(document.getElementById("empresa").value),
            nivelAcesso: Number(document.getElementById("nivelAcesso").value)
        })
    })
        .then(function (resposta) {
            return resposta.json().then(function (dados) {
                if (!resposta.ok) {
                    throw new Error(dados.mensagem || "Não foi possível cadastrar o usuário.");
                }

                return dados;
            });
        })
        .then(function (dados) {
            mensagem.textContent = dados.mensagem;
            cadastroForm.reset();
        })
        .catch(function (erro) {
            mensagem.textContent = erro instanceof TypeError
                ? "Não foi possível conectar ao servidor. Tente novamente."
                : erro.message;
        })
        .finally(function () {
            cadastrarButton.disabled = false;
        });
});
