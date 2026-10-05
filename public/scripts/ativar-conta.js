const token = new URLSearchParams(window.location.search).get("token");
const nameElement = document.getElementById("invitedUserName");
const emailElement = document.getElementById("invitedUserEmail");
const descriptionElement = document.getElementById("activationDescription");
const form = document.getElementById("activationForm");
const passwordInput = document.getElementById("passwordInput");
const confirmPasswordInput = document.getElementById("confirmPasswordInput");
const submitButton = document.getElementById("activationSubmit");
const submitLabel = document.getElementById("submitLabel");
const feedback = document.getElementById("formFeedback");

function setFeedback(message, success = false) {
    feedback.textContent = message;
    feedback.classList.toggle("success", success);
}

function updateInvitation(user) {
    const fullName = user.nome || user.nomeCompleto || "Usuário convidado";
    const firstName = fullName.trim().split(/\s+/)[0] || "";
    const email = user.email || "";

    nameElement.textContent = fullName;
    emailElement.textContent = email;
    descriptionElement.textContent = `Olá, ${firstName}! Você foi convidado para acessar a CoreTrace. Defina uma senha para concluir a ativação da sua conta.`;
}

async function loadInvitation() {
    if (!token) {
        setFeedback("Este link de ativação é inválido ou está incompleto.");
        submitButton.disabled = true;
        return;
    }

    try {
        const response = await fetch(`/ativar-conta?token=${encodeURIComponent(token)}`);
        if (!response.ok) throw new Error("Convite não encontrado");

        const data = await response.json();
        if (!data.usuario) throw new Error("Convite não encontrado");
        updateInvitation(data.usuario);
    } catch (error) {
        setFeedback("Não foi possível validar este convite. Solicite um novo link ao administrador.");
        submitButton.disabled = true;
    }
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setFeedback("");

    if (!passwordInput.value || !confirmPasswordInput.value) {
        setFeedback("Preencha e confirme sua nova senha.");
        return;
    }

    if (passwordInput.value.length < 6) {
        setFeedback("A senha deve ter pelo menos 6 caracteres.");
        return;
    }

    if (passwordInput.value !== confirmPasswordInput.value) {
        setFeedback("As senhas informadas não coincidem.");
        confirmPasswordInput.focus();
        return;
    }

    submitButton.disabled = true;
    submitLabel.textContent = "Ativando conta...";

    try {
        const response = await fetch("/ativar-conta", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, senha: passwordInput.value })
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.mensagem || "Não foi possível ativar a conta.");

        form.reset();
        setFeedback("Conta ativada com sucesso. Você já pode acessar a CoreTrace.", true);
        submitLabel.textContent = "Conta ativada";
    } catch (error) {
        setFeedback(error.message || "Não foi possível ativar a conta. Tente novamente.");
        submitButton.disabled = false;
        submitLabel.textContent = "Ativar conta";
    }
});

loadInvitation();
