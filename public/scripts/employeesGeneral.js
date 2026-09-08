loadEmployee()

async function loadEmployee() {
    let allSearches = {}
    let allChecks = {}
    try {
        allSearches = searchHistory()
    } catch (error) {
        console.log("Erro ao executar searchHistory()", error)
    }
    try {
        allChecks = checkHistory()
    } catch (error) {
        console.log("Erro ao executar checkHistory()", error)
    }
    try {
        const response = await fetch("/employee/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                filters: allSearches,
                sort: allChecks,
                empresaIdServer: sessionStorage.ID_EMPRESA
            })
        })

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
        }

        const result = await response.json()

        console.log(result)
        getServers(result)

    }
    catch (error) {
        console.log("Erro ao Carregar Funcionários.", error)
    }
}

function searchHistory() {
    let srchName = document.getElementById("srchName")
    let srchEmail = document.getElementById("srchEmail")
    let srchPosition = document.getElementById("srchPosition")
    srchName = srchName.value
    srchEmail = srchEmail.value
    srchPosition = srchPosition.value
    if (srchName == '') {
        srchName = "%%"
    }
    else {
        srchName += "%"
    }
    if (srchEmail == '') {
        srchEmail = "%%"
    }
    else {
        srchEmail += "%"
    }
    if (srchPosition == '') {
        srchPosition = "%%"
    }
    else {
        srchPosition += "%"
    }
    let allSearches = {
        "srchName": srchName,
        "srchEmail": srchEmail,
        "srchPosition": srchPosition
    }
    return allSearches
}

function checkHistory() {
    let chckEmployee = document.getElementById("chckEmployee")
    let chckEmail = document.getElementById("chckEmail")
    let chckPosition = document.getElementById("chckPosition")
    let chckData = document.getElementById("chckData")
    let chckActivities = document.getElementById("chckActivities")

    let marcadoEmployee = chckEmployee.checked
    let marcadoEmail = chckEmail.checked
    let marcadoPosition = chckPosition.checked
    let marcadoData = chckData.checked
    let marcadoAtividade = chckActivities.checked

    svg1=document.getElementById("svg1")
    svg2=document.getElementById("svg2")
    svg3=document.getElementById("svg3")
    svg4=document.getElementById("svg4")
    svg5=document.getElementById("svg5")    

    marcadoEmployee ?
    svg1.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M8.45739 19.5427L16.0001 12L23.5427 19.5427" stroke="#F6ECE6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>` : 
    svg1.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M23.5426 12.4573L15.9999 20L8.45728 12.4573" stroke="#F6ECE6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`

    marcadoEmail ? 
    svg2.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M8.45739 19.5427L16.0001 12L23.5427 19.5427" stroke="#F6ECE6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>` : 
    svg2.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M23.5426 12.4573L15.9999 20L8.45728 12.4573" stroke="#F6ECE6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`

    marcadoPosition ? 
    svg3.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M8.45739 19.5427L16.0001 12L23.5427 19.5427" stroke="#F6ECE6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>` : 
    svg3.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M23.5426 12.4573L15.9999 20L8.45728 12.4573" stroke="#F6ECE6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`

    marcadoData ? 
    svg4.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M8.45739 19.5427L16.0001 12L23.5427 19.5427" stroke="#F6ECE6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>` : 
    svg4.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M23.5426 12.4573L15.9999 20L8.45728 12.4573" stroke="#F6ECE6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`

    marcadoAtividade ? 
    svg5.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M8.45739 19.5427L16.0001 12L23.5427 19.5427" stroke="#F6ECE6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>` : 
    svg5.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M23.5426 12.4573L15.9999 20L8.45728 12.4573" stroke="#F6ECE6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`

    let allChecks = {
        "chckEmployee": marcadoEmployee ? "DESC" : "ASC",
        "chckEmail": marcadoEmail ? "DESC" : "ASC",
        "chckPosition": marcadoPosition ? "DESC" : "ASC",
        //    "chckData": marcadoData ? "DESC" : "ASC",
        //    "chckActivities": marcadoAtividade ? "DESC" : "ASC",
        "marcadoEmployee": marcadoEmployee,
        "marcadoEmail": marcadoEmail,
        "marcadoPosition": marcadoPosition
    }
    return allChecks
}

async function getServers(employees) {
    console.log(employees)

    let listContainer = document.getElementById("list")

    if (employees.length === 0) {
        listContainer.innerHTML = `<span>Nenhum funcionário encontrado</span>`
        return
    }

    let todosOsServers = []

    for (let i = 0; i < employees.length; i++) {
        let element = employees[i]

        const response = await fetch("/employee/catchServer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                employeeId: element["id"]
            })
        })

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
        }

        const serversFromEmployee = await response.json()
        console.log(serversFromEmployee)

        for (let j = 0; j < serversFromEmployee.length; j++) {
            todosOsServers.push(serversFromEmployee[j])
        }
    }

    employeePlotters(employees, todosOsServers)
}

function employeePlotters(employees, serversFromEmployee) {
    let listContainer = document.getElementById("list");
    listContainer.innerHTML = "";

    employees.forEach(employee => {
        let idUsuario = employee["id"];

        listContainer.innerHTML += `
        <div class="employeeVerticalBox">
            <input type="checkbox" id="user${idUsuario}">
            <div class="employeeBox">
                <div class="employeeFirstInfos">
                    <span id="${idUsuario}">${employee["nome"]}</span>
                    <span>${employee["email"]}</span>
                    <span id="${employee["tipo_papel"]}">${employee["papel"]}</span>
                    <span>dd/mm/yyyy HH:MM:SS</span>
                    <span>Ativo</span>
                </div>
                <div class="employeePermissions" id="employeePermissions${idUsuario}">
                </div>
            </div>
        </div>
        `;

        let empPermissions = document.getElementById(`employeePermissions${idUsuario}`);

        let sectorsHtml = "";
        let serversHtml = "";
        let setoresJaAdicionados = [];
        let temAcesso = false;

        for (let i = 0; i < serversFromEmployee.length; i++) {
            let server = serversFromEmployee[i];

            if (server["id_usuario"] == idUsuario && server["id_servidor"]) {
                temAcesso = true;

                let setorNome = server["nome_setor"];
                let jaExiste = false;

                for (let j = 0; j < setoresJaAdicionados.length; j++) {
                    if (setoresJaAdicionados[j] == setorNome) {
                        jaExiste = true;
                        break;
                    }
                }

                if (!jaExiste && setorNome) {
                    setoresJaAdicionados.push(setorNome);
                    sectorsHtml += `<span>${setorNome}</span>`;
                }

                serversHtml += `
                <div class="machineServer">
                    <span>${server["codigo_maquina"] ?? "-"}</span>
                    <span>${server["nome_servidor"] ?? "-"}</span>
                </div>
                `;
            }
        }

        if (!temAcesso) {
            empPermissions.innerHTML = `<span>Nenhum acesso vinculado</span>`;
        } else {
            empPermissions.innerHTML = `
                <div class="epSectors">
                    <span>Setores:</span>
                    <div class="epSectorsList">
                        ${sectorsHtml}
                    </div>
                </div>
                <div class="epServers">
                    <div class="epServersTitle">
                        <span>Máquinas</span>
                        <span>Servidores</span>
                    </div>
                    <div class="epServersList">
                        ${serversHtml}
                    </div>
                </div>
            `;
        }
        listContainer.innerHTML+= `
        <div class="openList">
            <input type="checkbox" id="svgUI${idUsuario}">
            <div onclick=openList(${idUsuario}) id =svgGUI${idUsuario}></div>
        </div>`
        openList(idUsuario)
    });
}