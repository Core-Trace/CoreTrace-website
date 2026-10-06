(() => {
    let carregamentoWizard;
    let botaoOrigem;

    function configurarWizard(dialogo) {
        const formulario = dialogo.querySelector("form");
        const nome = formulario.elements.nome;
        const descricao = formulario.elements.descricao;
        const contador = dialogo.querySelector("#perfil-contador");

        dialogo.querySelector(".wizard-fechar").addEventListener("click", () => dialogo.close());
        dialogo.addEventListener("close", () => {
            document.body.classList.remove("wizard-perfil-aberto");
            botaoOrigem?.focus();
        });

        let cliqueNoFundo = false;
        function foraDoDialogo(event) {
            const limites = dialogo.getBoundingClientRect();
            return event.clientX < limites.left || event.clientX > limites.right
                || event.clientY < limites.top || event.clientY > limites.bottom;
        }

        dialogo.addEventListener("pointerdown", (event) => {
            cliqueNoFundo = event.target === dialogo && foraDoDialogo(event);
        });
        dialogo.addEventListener("click", (event) => {
            if (cliqueNoFundo && event.target === dialogo && foraDoDialogo(event)) dialogo.close();
            cliqueNoFundo = false;
        });

        descricao.addEventListener("input", () => {
            contador.textContent = `${descricao.value.length}/500`;
        });
        nome.addEventListener("input", () => nome.setCustomValidity(""));
        nome.addEventListener("blur", () => {
            nome.setCustomValidity(nome.value !== "" && nome.value.trim() === ""
                ? "Informe o nome do perfil." : "");
        });

        // Esta entrega contempla apenas Informações básicas; não cadastrar um perfil incompleto.
        formulario.addEventListener("submit", (event) => event.preventDefault());
    }

    function carregarWizard() {
        if (!carregamentoWizard) {
            carregamentoWizard = fetch("../components/wizardPerfilServidor.html")
                .then(async (resposta) => {
                    if (!resposta.ok) throw new Error("Não foi possível abrir o formulário. Tente novamente.");

                    const template = document.createElement("template");
                    template.innerHTML = await resposta.text();
                    const dialogo = template.content.querySelector("dialog");
                    if (!dialogo) throw new Error("Não foi possível abrir o formulário. Tente novamente.");

                    document.body.append(dialogo);
                    configurarWizard(dialogo);
                    return dialogo;
                })
                .catch((erro) => {
                    carregamentoWizard = null;
                    throw erro;
                });
        }

        return carregamentoWizard;
    }

    document.querySelectorAll("[data-abrir-wizard-perfil]").forEach((botao) => {
        botao.addEventListener("click", async () => {
            botao.disabled = true;
            botao.setAttribute("aria-busy", "true");
            const erroAnterior = botao.parentElement.querySelector(".wizard-erro-abertura");
            erroAnterior?.remove();

            try {
                const dialogo = await carregarWizard();
                if (dialogo.open) return;

                botaoOrigem = botao;
                document.body.classList.add("wizard-perfil-aberto");
                dialogo.showModal();
                dialogo.scrollTop = 0;
                dialogo.querySelector("#perfil-nome").focus();
            } catch (erro) {
                const feedback = document.createElement("p");
                feedback.className = "wizard-erro-abertura";
                feedback.setAttribute("role", "alert");
                feedback.textContent = "Não foi possível abrir o formulário. Tente novamente.";
                botao.after(feedback);
            } finally {
                botao.disabled = false;
                botao.removeAttribute("aria-busy");
            }
        });
    });
})();
