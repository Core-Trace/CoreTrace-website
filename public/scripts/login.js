// Tela visual: impede o envio dos campos enquanto a autenticação não está implementada.
document.querySelector("#loginForm").addEventListener("submit", function (event) {
    event.preventDefault();
});
