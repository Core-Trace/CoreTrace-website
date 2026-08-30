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

nextButton.addEventListener('click', showSecondStep);
connectSelectAll('selectAllSectors', 'sector-checkbox');
connectSelectAll('selectAllMachines', 'machine-checkbox');

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
