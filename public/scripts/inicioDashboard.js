const menu = document.querySelector(".menu");
const botaoMenu = document.querySelector(".botao-menu");

botaoMenu.addEventListener("click", function () {
    menu.classList.toggle("fechado");

    if (menu.classList.contains("fechado")) {
        botaoMenu.innerHTML = "☰";
    } else {
        botaoMenu.innerHTML = "×";
    }
});