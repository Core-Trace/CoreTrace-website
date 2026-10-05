document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector(".cabecalho .navbar");

    if (!navbar) return;

    const toggle = navbar.querySelector(".navbar-toggle");
    const menu = navbar.querySelector(".navbar-menu");

    if (!toggle || !menu) return;

    const closeMenu = () => {
        navbar.classList.remove("menu-aberto");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menu");
        document.body.classList.remove("menu-aberto");
    };

    const openMenu = () => {
        navbar.classList.add("menu-aberto");
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "Fechar menu");
        document.body.classList.add("menu-aberto");
    };

    toggle.addEventListener("click", () => {
        navbar.classList.contains("menu-aberto") ? closeMenu() : openMenu();
    });

    menu.addEventListener("click", (event) => {
        if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("click", (event) => {
        const clickedOutsideMenu = !menu.contains(event.target) && !toggle.contains(event.target);

        if (navbar.classList.contains("menu-aberto") && clickedOutsideMenu) {
            event.preventDefault();
            event.stopPropagation();
            closeMenu();
        }
    }, true);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && navbar.classList.contains("menu-aberto")) {
            closeMenu();
            toggle.focus();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 800) closeMenu();
    });
});
