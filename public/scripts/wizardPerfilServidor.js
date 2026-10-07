(() => {
    let carregamentoWizard;
    let botaoOrigem;

    function configurarWizard(dialogo) {
        const formulario = dialogo.querySelector("form");
        const nome = formulario.elements.nome;
        const descricao = formulario.elements.descricao;
        const contador = dialogo.querySelector("#perfil-contador");
        const titulo = dialogo.querySelector("#wizard-titulo");
        const introducao = dialogo.querySelector("#wizard-descricao");
        const conteudo = dialogo.querySelector(".wizard-conteudo");
        const proximo = dialogo.querySelector(".wizard-proximo");
        const recomendar = dialogo.querySelector(".wizard-recomendar");
        const metricas = dialogo.querySelector(".wizard-metricas");
        const lista = dialogo.querySelector(".wizard-metricas-lista");
        const resumo = dialogo.querySelector(".wizard-metricas-resumo");
        const carregando = dialogo.querySelector(".wizard-metricas-carregando");
        const erro = dialogo.querySelector(".wizard-metricas-erro");
        const vazio = dialogo.querySelector(".wizard-metricas-vazio");
        let etapa = 1;
        let catalogoCarregado = false;
        let buscandoMetricas = false;

        const icones = {
            cpu: "cpu.svg", ram: "ram.svg", disco: "disco.svg", swap: "swap.svg",
            carga: "carga.svg", rede: "carga.svg", outros: "servidor.svg"
        };

        function atualizarContadores() {
            let total = 0;
            let categoriasSelecionadas = 0;
            lista.querySelectorAll(".wizard-metrica-categoria").forEach((categoria) => {
                const selecionadas = categoria.querySelectorAll("input:checked").length;
                const quantidade = categoria.querySelectorAll("input").length;
                const contagem = categoria.querySelector(".wizard-metrica-contagem");
                contagem.textContent = `${selecionadas}/${quantidade}`;
                contagem.setAttribute("aria-label", `${selecionadas} de ${quantidade} métricas selecionadas`);
                total += selecionadas;
                if (selecionadas > 0) categoriasSelecionadas++;
            });

            resumo.textContent = total === 0
                ? "Selecione ao menos uma métrica para este perfil."
                : `${total} ${total === 1 ? "métrica selecionada" : "métricas selecionadas"} em ${categoriasSelecionadas} ${categoriasSelecionadas === 1 ? "categoria" : "categorias"}`;
            resumo.classList.toggle("sem-selecao", total === 0);
        }

        function criarCategoria(categoria, indice) {
            const card = document.createElement("section");
            card.className = "wizard-metrica-categoria";
            card.setAttribute("aria-labelledby", `metricas-categoria-${indice}`);
            const cabecalho = document.createElement("header");
            cabecalho.className = "wizard-metrica-cabecalho";
            const icone = document.createElement("img");
            icone.src = `../assets/icons/${icones[categoria.id] || icones.outros}`;
            icone.alt = "";
            icone.width = 30;
            icone.height = 30;
            const nomeCategoria = document.createElement("h3");
            nomeCategoria.id = `metricas-categoria-${indice}`;
            nomeCategoria.textContent = categoria.nome;
            const contagem = document.createElement("span");
            contagem.className = "wizard-metrica-contagem";
            cabecalho.append(icone, nomeCategoria, contagem);
            card.append(cabecalho);

            categoria.metricas.forEach((metrica) => {
                const label = document.createElement("label");
                label.className = "wizard-metrica-opcao";
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.name = "metricas";
                checkbox.value = metrica.id;
                checkbox.checked = metrica.recomendada === true;
                checkbox.dataset.recomendada = String(metrica.recomendada === true);
                const texto = document.createElement("span");
                texto.textContent = metrica.nome;
                label.append(checkbox, texto);
                card.append(label);
            });
            return card;
        }

        async function carregarMetricas() {
            if (catalogoCarregado || buscandoMetricas) return;
            buscandoMetricas = true;
            metricas.setAttribute("aria-busy", "true");
            carregando.hidden = false;
            erro.hidden = true;
            vazio.hidden = true;
            lista.hidden = true;
            resumo.hidden = true;
            recomendar.disabled = true;

            try {
                const resposta = await fetch("/servidor/metricas");
                if (!resposta.ok) throw new Error("Falha ao consultar métricas.");
                const dados = await resposta.json();
                if (!Array.isArray(dados.categorias)
                    || !dados.categorias.every((categoria) => Array.isArray(categoria.metricas))) {
                    throw new Error("Catálogo de métricas inválido.");
                }

                const categorias = dados.categorias.filter((categoria) => categoria.metricas.length > 0);
                lista.replaceChildren(...categorias.map(criarCategoria));
                vazio.hidden = categorias.length > 0;
                lista.hidden = categorias.length === 0;
                resumo.hidden = categorias.length === 0;
                recomendar.disabled = categorias.length === 0;
                atualizarContadores();
                catalogoCarregado = true;
            } catch (falha) {
                erro.hidden = false;
            } finally {
                carregando.hidden = true;
                metricas.setAttribute("aria-busy", "false");
                buscandoMetricas = false;
            }
        }

        function mostrarEtapa(numero) {
            etapa = numero;
            dialogo.dataset.etapa = numero;
            dialogo.style.setProperty("--wizard-etapas-concluidas", numero - 1);
            dialogo.querySelectorAll("[data-etapa]").forEach((painel) => {
                painel.hidden = Number(painel.dataset.etapa) !== numero;
            });
            dialogo.querySelectorAll(".wizard-etapas li").forEach((item, indice) => {
                item.classList.toggle("wizard-etapa-concluida", indice + 1 < numero);
                if (indice + 1 === numero) item.setAttribute("aria-current", "step");
                else item.removeAttribute("aria-current");
            });

            const nomeEtapa = numero === 1 ? "Informações básicas" : "Métricas";
            titulo.textContent = nomeEtapa;
            introducao.textContent = numero === 1
                ? "Comece dando um nome ao perfil do servidor e escolha o sistema operacional que será utilizado."
                : "Selecione ao menos uma métrica para os servidores deste perfil. Após vincular servidores, as métricas ficam bloqueadas.";
            dialogo.querySelector(".wizard-etapa-contagem").textContent = `Etapa ${numero} de 5`;
            dialogo.querySelector(".wizard-etapa-atual").textContent = nomeEtapa;
            recomendar.hidden = numero !== 2;

            // Contêineres será implementado na próxima entrega. Não salvar o perfil incompleto.
            proximo.disabled = numero === 2;
            if (numero === 2) proximo.title = "A próxima etapa ainda não está disponível.";
            else proximo.removeAttribute("title");
            conteudo.scrollTop = 0;
            titulo.focus({ preventScroll: true });
            if (numero === 2) carregarMetricas();
        }

        formulario.addEventListener("submit", (event) => {
            event.preventDefault();
            if (etapa !== 1) return;
            nome.setCustomValidity(nome.value.trim() === "" ? "Informe o nome do perfil." : "");
            if (formulario.reportValidity()) mostrarEtapa(2);
        });
        dialogo.querySelector(".wizard-voltar").addEventListener("click", () => {
            if (etapa === 1) dialogo.close();
            else mostrarEtapa(1);
        });
        lista.addEventListener("change", atualizarContadores);
        recomendar.addEventListener("click", () => {
            lista.querySelectorAll("input").forEach((checkbox) => {
                checkbox.checked = checkbox.dataset.recomendada === "true";
            });
            atualizarContadores();
        });
        dialogo.querySelector(".wizard-metricas-tentar").addEventListener("click", carregarMetricas);
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
    }

    function carregarWizard() {
        if (!carregamentoWizard) {
            carregamentoWizard = fetch("../components/wizardPerfilServidor.html")
                .then(async (resposta) => {
                    if (!resposta.ok) throw new Error("Não foi possível abrir o formulário.");
                    const template = document.createElement("template");
                    template.innerHTML = await resposta.text();
                    const dialogo = template.content.querySelector("dialog");
                    if (!dialogo) throw new Error("Não foi possível abrir o formulário.");
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
            botao.parentElement.querySelector(".wizard-erro-abertura")?.remove();
            try {
                const dialogo = await carregarWizard();
                if (dialogo.open) return;
                botaoOrigem = botao;
                document.body.classList.add("wizard-perfil-aberto");
                dialogo.showModal();
                dialogo.querySelector(".wizard-conteudo").scrollTop = 0;
                const foco = window.matchMedia("(max-width: 700px)").matches
                    ? dialogo.querySelector("#wizard-titulo")
                    : dialogo.querySelector('[data-etapa="1"]:not([hidden]) input') || dialogo.querySelector("#wizard-titulo");
                foco.focus({ preventScroll: true });
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
