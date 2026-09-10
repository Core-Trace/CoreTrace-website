const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("emailInput");
const senhaInput = document.getElementById("senhaInput");
const loginFeedback = document.getElementById("loginFeedback");
const nextButton = loginForm.querySelector("#id_btnext");
const loginButton = document.getElementById("id_btnlogin");
const firstStep = document.getElementById("firstStep");
const secondStep = document.getElementById("secondStep");

let emailVar;
let  senhaVar;

function showSecondStep() {
	emailVar = emailInput.value;
	senhaVar = senhaInput.value;

	firstStep.classList.remove("active");
	secondStep.classList.add("active");
	secondDot.classList.remove("inactive");
	secondDot.classList.add("active");
	stepLine.classList.add("active");
	document.body.classList.add("second-step-active");
}

function showFirstStep() {
    firstStep.classList.add("active");
	secondStep.classList.remove("active");
	secondDot.classList.add("inactive");
	secondDot.classList.remove("active");
	stepLine.classList.remove("active");
	document.body.classList.remove("second-step-active");
}

function entrar(event) {
	event.preventDefault();

	const passKey = passKeyInput.value;

	loginFeedback.textContent = "";
	alternarCarregamento(loginButton, null, true);

	return enviarJson("/user/auth", {
		emailServer: emailVar,
		senhaServer: senhaVar,
		passKeyServer: passKey,
	})
		.then(function (usuario) {
			console.log(usuario);
			sessionStorage.ID_USUARIO = usuario.id;
			sessionStorage.NOME_USUARIO = usuario.nome;
			sessionStorage.EMAIL_USUARIO = usuario.email;
			sessionStorage.ID_EMPRESA = usuario.empresa;
			sessionStorage.ID_PAPEL = usuario.papel.id;
			sessionStorage.NOME_PAPEL = usuario.papel.nome;
			sessionStorage.TIPO_PAPEL = usuario.papel.tipo;

			if (usuario.papel.tipo === "GESTOR") {
				window.location = "/pages/cadastro-funcionario.html";
			} else {
				window.location = "/pages/dashboard.html";
			}
		})
		.catch(function (erro) {
			console.error("#ERRO ao realizar o login:", erro);
            showFirstStep()
			loginFeedback.textContent = erro.message;
			alternarCarregamento(loginButton, null, false);
		});
}

nextButton.addEventListener("click", showSecondStep);
loginButton.addEventListener("click", entrar);
