const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("emailInput");
const senhaInput = document.getElementById("senhaInput");
const loginFeedback = document.getElementById("loginFeedback");
const loginButton = loginForm.querySelector("button[type='submit']");

function entrar(event) {
    event.preventDefault();

    const emailVar = emailInput.value;
    const senhaVar = senhaInput.value;

    loginFeedback.textContent = "";
    alternarCarregamento(loginButton, null, true);

    return enviarJson("/user/auth", {
        emailServer: emailVar,
        senhaServer: senhaVar
    })
        .then(function (usuario) {
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
                window.location = "/pages/loginPass.html";
            }
        })
        .catch(function (erro) {
            console.error("#ERRO ao realizar o login:", erro);
            loginFeedback.textContent = erro.message;
            alternarCarregamento(loginButton, null, false);
        });
}


loginForm.addEventListener("submit", entrar);
