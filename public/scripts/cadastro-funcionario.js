const employeeForm = document.getElementById('employeeForm');
const firstStep = document.getElementById('firstStep');
const secondStep = document.getElementById('secondStep');
const firstStepFields = firstStep.querySelectorAll('input, select');
const nextButton = document.getElementById('nextButton');
const secondDot = document.getElementById('secondDot');
const stepLine = document.getElementById('stepLine');
const formFeedback = document.getElementById('formFeedback');
const loggedUserName = document.getElementById('loggedUserName');
const loggedUserEmail = document.getElementById('loggedUserEmail');
const logoutLink = document.getElementById('logoutLink');
const submitButton = employeeForm.querySelector("button[type='submit']");
const registerLoading = document.getElementById('registerLoading');
const employeeNameInput = document.getElementById('employeeName');
const employeeEmailInput = document.getElementById('employeeEmail');
const employeePasswordInput = document.getElementById('employeePassword');
const employeeRoleInput = document.getElementById('employeeRole');

loggedUserName.textContent = sessionStorage.NOME_USUARIO || 'Usuário';
loggedUserEmail.textContent = sessionStorage.EMAIL_USUARIO || '';

function validateFirstStep() {
    for (const field of firstStepFields) {
        if (!field.reportValidity()) {
            return false;
        }
    }

    return true;
}

function showSecondStep() {
    if (!validateFirstStep()) {
        return;
    }

    firstStep.classList.remove('active');
    secondStep.classList.add('active');
    secondDot.classList.remove('inactive');
    secondDot.classList.add('active');
    stepLine.classList.add('active');
    document.body.classList.add('second-step-active');
}
/*
function connectSelectAll(selectAllId, itemClass) {
    const selectAll = document.getElementById(selectAllId);
    const items = [...document.querySelectorAll(`.${itemClass}`)];

    selectAll.addEventListener('change', () => {
        items.forEach((item) => {
            item.checked = selectAll.checked;
        });
    });

    items.forEach((item) => {
        item.addEventListener('change', () => {
            selectAll.checked = items.every((checkbox) => checkbox.checked);
        });
    });
}
*/
nextButton.addEventListener('click', showSecondStep);
/*
connectSelectAll('selectAllSectors', 'sector-checkbox');
connectSelectAll('selectAllMachines', 'machine-checkbox');
*/
function cadastrar(event) {
    event.preventDefault();

    if (!employeeForm.reportValidity()) {
        return;
    }

    const nomeVar = employeeNameInput.value;
    const emailVar = employeeEmailInput.value;
    const senhaVar = employeePasswordInput.value;
    const papelVar = Number(employeeRoleInput.value);
    const cadastradoVar = Number(sessionStorage.ID_USUARIO);
    const empresaVar = Number(sessionStorage.ID_EMPRESA);

    formFeedback.classList.remove('success');
    formFeedback.textContent = '';

    if (!cadastradoVar || !empresaVar) {
        formFeedback.textContent = 'Faça login novamente antes de cadastrar um funcionário.';
        return;
    }

    const machineCheckboxes = document.querySelectorAll('.machine-checkbox:checked');
    const acessos = [...machineCheckboxes].map(function (checkbox) {
        return {
            servidor: Number(checkbox.dataset.servidor),
            maquina: Number(checkbox.value)
        };
    });

    if (acessos.length === 0) {
        formFeedback.textContent = 'Selecione ao menos uma máquina para conceder acesso.';
        return;
    }

    alternarCarregamento(submitButton, registerLoading, true);

    return enviarJson('/user/register', {
        nomeServer: nomeVar,
        emailServer: emailVar,
        senhaServer: senhaVar,
        papelServer: papelVar,
        cadastradoServer: cadastradoVar,
        empresaServer: empresaVar
    })
        .then(function (funcionario) {
            return enviarJson('/user/acessos', {
                usuario: funcionario.id,
                concedidoPor: cadastradoVar,
                acessos: acessos
            }).then(function () {
                return funcionario;
            });
        })
        .then(function (funcionario) {
            formFeedback.classList.add('success');
            formFeedback.textContent = 'Funcionário ' + funcionario.nome + ' cadastrado com sucesso!';
            alternarCarregamento(submitButton, registerLoading, false);
        })
        .catch(function (erro) {
            console.error('#ERRO ao cadastrar funcionário:', erro);
            formFeedback.textContent = erro.message;
            alternarCarregamento(submitButton, registerLoading, false);
        });
}

employeeForm.addEventListener('submit', cadastrar);

logoutLink.addEventListener('click', function () {
    sessionStorage.clear();
});
async function getSectors(){
    const idEmpresa = Number(sessionStorage.ID_EMPRESA);
    if(!idEmpresa){
        console.log("idEmpresa não encontrada")
        return;
    }
    else{
        const response = await fetch("/user/getSectors", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idEmpresa: idEmpresa,
            })
        })
        if(!response.ok){
            throw new Error(`HTTP ${response.status}`)}
            const sectors = await response.json()
            plotSectors(sectors)
        }
    }
    getSectors()

async function getMachines(sector){
    if(!sector){
        console.log("servidor não encontrado!")
    }else{
        const response = await fetch("/user/getMachines", {
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                setor: sector,
            })
        })
        if(!response.ok){
            throw new Error(`HTTP ${response.status}`)
        }
        const machines = await response.json()
        plotMachines(machines,sector)
        
    }
}

function plotSectors(sectors){
    let campoSetores= document.getElementById("setoresSelectionBox")
    campoSetores.innerHTML = ""
    sectors.forEach(element => {
        campoSetores.innerHTML+=`<label><input class="sector-checkbox" type="checkbox" name="sectors" id="${element["id_setores"]}" onchange="getMachines(${element["id_setores"]})">
                                        ${element["nome"]}</label>`
    });
}
let allMachinesBySector = {};

function plotMachines(machines, sector){
    const chckBox = document.getElementById(`${sector}`);
    const campoMachine = document.getElementById("machineSelectionBox");

    if(!chckBox){
        console.log("checkbox do setor não encontrado:", sector);
        return;
    }

    if(chckBox.checked){
        allMachinesBySector[sector] = machines;
    }else{
        delete allMachinesBySector[sector];
    }

    const setoresAtivos = Object.keys(allMachinesBySector);

    if(setoresAtivos.length === 0){
        campoMachine.innerHTML = `<span>Nenhuma Máquina Encontrada</span>`;
        return;
    }

    campoMachine.innerHTML = "";
    setoresAtivos.forEach(function(setorId){
        allMachinesBySector[setorId].forEach(function(element){
            campoMachine.innerHTML += `<label><span><input class="machine-checkbox" type="checkbox" name="machines"
                                value="${element["id_maquina"]}" data-servidor="${element["servidor"]}"> ${element["nome_maquina"]}</span><span>${element["nome_setor"]}</span></label>`;
        });
    });
}

function selectAllSectors(){
    const selectAll = document.getElementById('selectAllSectorsid');
    const container = document.getElementById('setoresSelectionBox');
    const sectorCheckboxes = container.querySelectorAll('input[type="checkbox"]');

    sectorCheckboxes.forEach(function(checkbox){
        if(checkbox.checked !== selectAll.checked){
            checkbox.checked = selectAll.checked;
            checkbox.dispatchEvent(new Event('change'));
        }
    });
}

function selectAllMachines(){
    const selectAll = document.getElementById('selectAllMachinesid');
    const container = document.getElementById('machineSelectionBox');
    const machineCheckboxes = container.querySelectorAll('input[type="checkbox"]');

    machineCheckboxes.forEach(function(checkbox){
        checkbox.checked = selectAll.checked;
    });
}