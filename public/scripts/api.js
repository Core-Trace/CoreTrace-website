function enviarJson(url, dados) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    }).then(function (resposta) {
        if (resposta.ok) {
            return resposta.json();
        }

        return resposta.text().then(function (mensagem) {
            throw new Error(mensagem || 'Não foi possível concluir a solicitação.');
        });
    });
}

function alternarCarregamento(botao, indicador, carregando) {
    botao.disabled = carregando;

    if (indicador) {
        botao.hidden = carregando;
        indicador.hidden = !carregando;
    }
}
