let cadastrarFunc = document.querySelector("#CadastrarFuncionario");
let verFunc = document.querySelector("#VerFuncionarios");

function gerarAside(papel) {
	console.log(papel);
	if (papel != 1) {
		cadastrarFunc.style.display = "none";
		verFunc.style.display = "none";
	}
}

var bolinhas = ['<span style="color:#f5ede4 ; font-size: 30px; width: 100%; align-items: right"> •</span>','<span style="color: red; font-size: 30px; width: 100%; align-items: right">•</span>', '<span style="color: yellow; font-size: 30px; width: 100%; align-items: right">•</span>', '<span style="color: yellow; font-size: 30px; width: 100%; align-items: right">•</span>',
	'<span style="color: #f5ede4; font-size: 30px; width: 100%; align-items: right">•</span>', '<span style="color: red; font-size: 30px; width: 100%; align-items: right">•</span>'];
	
let statusChckBoxSectors = JSON.parse(
	sessionStorage.getItem("statusChckBoxSectors") || "[]"
);

let statusChckBoxServers = JSON.parse(
	sessionStorage.getItem("statusChckBoxServers") || "[]"
);

function salvarStatus() {
	sessionStorage.setItem(
		"statusChckBoxSectors",
		JSON.stringify(statusChckBoxSectors)
	);

	sessionStorage.setItem(
		"statusChckBoxServers",
		JSON.stringify(statusChckBoxServers)
	);
}

async function carregarMenuServidores() {
	const menu = document.getElementById("menuServidores");

	try {
		const dados = await enviarJson("/employee/catchServer/", {
			employeeId: sessionStorage.ID_USUARIO,
		});

		menu.innerHTML = `
			<input 
				type="checkbox" 
				id="asideSectorsFirstChckBox" 
				style="display:none"
			>
		`;

		const setores = {};

		dados.forEach((item) => {
			if (!setores[item.id_setor]) {
				setores[item.id_setor] = {
					nome: item.nome_setor,
					servidores: {},
					id_setor: item.id_setor
				};
			}

			if (!setores[item.id_setor].servidores[item.id_servidor]) {
				setores[item.id_setor].servidores[item.id_servidor] = {
					nome: item.nome_servidor,
					maquinas: [],
					id_servidor: item.id_servidor
				};
			}

			setores[item.id_setor]
				.servidores[item.id_servidor]
				.maquinas
				.push(item);
		});

		Object.values(setores).forEach((setor) => {
			console.log(setor);

			const setorDiv = document.createElement("div");
			setorDiv.classList.add("sidebar-group");

			const setorEstaAberto =
				statusChckBoxSectors.includes(setor.id_setor);

			const setorTitulo = document.createElement("div");
			setorTitulo.classList.add("sidebar-group-title");

			setorTitulo.innerHTML = `
				<svg 
					width="14" 
					height="14" 
					viewBox="0 0 24 24"
					fill="none" 
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<polyline 
						points="${
							setorEstaAberto
								? "6 9 12 15 18 9"
								: "9 6 15 12 9 18"
						}" 
						id="chckSideBarSector-${setor.id_setor}"
					></polyline>
				</svg>

				${setor.nome}
			`;

			const servidoresDiv = document.createElement("div");

			servidoresDiv.id = `serverFrom${setor.id_setor}`;
			servidoresDiv.classList.add("sidebar-group-content");

			servidoresDiv.style.display =
				setorEstaAberto ? "flex" : "none";

			setorTitulo.onclick = function () {
				const idSetor = setor.id_setor;

				const estaAberto =
					statusChckBoxSectors.includes(idSetor);

				const asideServerFrom =
					document.getElementById(
						`serverFrom${idSetor}`
					);

				const svg =
					document.getElementById(
						`chckSideBarSector-${idSetor}`
					);

				if (estaAberto) {
					statusChckBoxSectors =
						statusChckBoxSectors.filter(
							(id) => id != idSetor
						);

					asideServerFrom.style.display = "none";

					svg.setAttribute(
						"points",
						"9 6 15 12 9 18"
					);
				} else {
					statusChckBoxSectors.push(idSetor);

					asideServerFrom.style.display = "flex";

					svg.setAttribute(
						"points",
						"6 9 12 15 18 9"
					);
				}

				salvarStatus();
			};

			Object.values(setor.servidores).forEach((servidor) => {
				console.log(servidor);

				const servidorDiv = document.createElement("div");
				servidorDiv.classList.add("sidebar-group");

				const servidorEstaAberto =
					statusChckBoxServers.includes(
						servidor.id_servidor
					);

				const servidorTitulo =
					document.createElement("div");

				servidorTitulo.classList.add(
					"sidebar-group-title"
				);

				servidorTitulo.innerHTML = `
					<svg
						width="14" 
						height="14" 
						viewBox="0 0 24 24"
						fill="none" 
						stroke="currentColor"
						stroke-width="3"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polyline 
							points="${
								servidorEstaAberto
									? "6 9 12 15 18 9"
									: "9 6 15 12 9 18"
							}" 
							id="svgAsideFromServer-${servidor.id_servidor}"
						></polyline>
					</svg>

					${servidor.nome}
				`;

				const maquinasDiv =
					document.createElement("div");

				maquinasDiv.id =
					`machsFrom${servidor.id_servidor}`;

				maquinasDiv.classList.add(
					"sidebar-group-content"
				);

				maquinasDiv.style.display =
					servidorEstaAberto
						? "flex"
						: "none";

				servidorTitulo.onclick = function () {
					const idServidor =
						servidor.id_servidor;

					const estaAberto =
						statusChckBoxServers.includes(
							idServidor
						);

					const asideServerFrom =
						document.getElementById(
							`machsFrom${idServidor}`
						);

					const svg =
						document.getElementById(
							`svgAsideFromServer-${idServidor}`
						);

					if (estaAberto) {
						statusChckBoxServers =
							statusChckBoxServers.filter(
								(id) => id != idServidor
							);

						asideServerFrom.style.display =
							"none";

						svg.setAttribute(
							"points",
							"9 6 15 12 9 18"
						);
					} else {
						statusChckBoxServers.push(
							idServidor
						);

						asideServerFrom.style.display =
							"flex";

						svg.setAttribute(
							"points",
							"6 9 12 15 18 9"
						);
					}

					salvarStatus();
				};

				const machineAtual =
					new URLSearchParams(
						window.location.search
					).get("machine");

				for (
					let i = 0;
					i < servidor.maquinas.length;
					i++
				) {
					const maquina =
						servidor.maquinas[i];

					const maquinaLink =
						document.createElement("a");

					maquinaLink.classList.add(
						"sidebar-sub-link"
					);

					maquinaLink.textContent =
						maquina.nome_maquina;

					maquinaLink.innerHTML +=
						bolinhas[
							maquina.id_maquina - 1
						];

					maquinaLink.href =
						`dashboard.html?machine=${maquina.id_maquina}`;

					if (
						machineAtual ==
						maquina.id_maquina
					) {
						maquinaLink.classList.add(
							"active"
						);

						const idMachine =
							document.getElementById(
								"id_machine"
							);

						if (idMachine) {
							idMachine.textContent =
								maquina.nome_maquina;
						}
					}

					maquinasDiv.appendChild(
						maquinaLink
					);
				}

				servidorDiv.appendChild(
					servidorTitulo
				);

				servidorDiv.appendChild(
					maquinasDiv
				);

				servidoresDiv.appendChild(
					servidorDiv
				);
			});

			setorDiv.appendChild(setorTitulo);
			setorDiv.appendChild(servidoresDiv);

			menu.appendChild(setorDiv);
		});
	} catch (erro) {
		console.error(
			"Erro ao carregar servidores:",
			erro
		);
	}
}

gerarAside(sessionStorage.getItem("ID_PAPEL"));
carregarMenuServidores();
