let cadastrarFunc = document.getElementById("CadastrarFuncionario");
let verFunc = document.getElementById("VerFuncionarios");

function gerarAside(papel) {
	console.log(papel[0]["papel"]);
	if (papel[0]["papel"] != 1) {
		cadastrarFunc.style.display = "none";
		verFunc.style.display = "none";
	}
}
gerarAside(sessionStorage.ID_PAPEL);


async function carregarMenuServidores() {
	const menu = document.getElementById("menuServidores");

	try {
		const dados = await enviarJson("/employee/catchServer/", {
			employeeId: sessionStorage.ID_USUARIO,
		});

		console.log("Servidores:", dados);

		menu.innerHTML = "";

		const setores = {};

		dados.forEach((item) => {
			if (!setores[item.id_setor]) {
				setores[item.id_setor] = {
					nome: item.nome_setor,
					servidores: {},
				};
			}

			if (!setores[item.id_setor].servidores[item.id_servidor]) {
				setores[item.id_setor].servidores[item.id_servidor] = {
					nome: item.nome_servidor,
					maquinas: [],
				};
			}

			setores[item.id_setor].servidores[item.id_servidor].maquinas.push(item);
		});

		Object.values(setores).forEach((setor) => {
			const setorDiv = document.createElement("div");
			setorDiv.classList.add("sidebar-group");

			const setorTitulo = document.createElement("div");
			setorTitulo.classList.add("sidebar-group-title");

			setorTitulo.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
                ${setor.nome}
            `;

			const servidoresDiv = document.createElement("div");
			servidoresDiv.classList.add("sidebar-group-content");

			Object.values(setor.servidores).forEach((servidor) => {
				const servidorDiv = document.createElement("div");
				servidorDiv.classList.add("sidebar-group");

				const servidorTitulo = document.createElement("div");
				servidorTitulo.classList.add("sidebar-group-title");

				servidorTitulo.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor"
                        stroke-width="3"
                        stroke-linecap="round"
                        stroke-linejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                    ${servidor.nome}
                `;

				const maquinasDiv = document.createElement("div");
				maquinasDiv.classList.add("sidebar-group-content");

				servidor.maquinas.forEach((maquina) => {
					const maquinaLink = document.createElement("a");
                    
					maquinaLink.classList.add("sidebar-sub-link");
					maquinaLink.textContent = maquina.nome_maquina;
					maquinaLink.href = `dashboard.html?machine=${maquina.id_maquina}`;

					const machineAtual = new URLSearchParams(window.location.search).get("machine");

					if (machineAtual == maquina.id_maquina) {
						maquinaLink.classList.add("active");
					}

					maquinasDiv.appendChild(maquinaLink);
				});

				servidorDiv.appendChild(servidorTitulo);
				servidorDiv.appendChild(maquinasDiv);

				servidoresDiv.appendChild(servidorDiv);
			});

			setorDiv.appendChild(setorTitulo);
			setorDiv.appendChild(servidoresDiv);

			menu.appendChild(setorDiv);
		});
	} catch (erro) {
		console.error("Erro ao carregar servidores:", erro);
	}
}

carregarMenuServidores();
