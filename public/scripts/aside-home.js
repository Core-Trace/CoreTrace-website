let fullScreen = document.getElementById("fullScreen")
fullScreen.style.display = "none"
let fullScreenActual = "none"

function asidePlot() {
    if (fullScreenActual == "none") {
        fullScreenActual = "flex"
        fullScreen.style.display = fullScreenActual
        document.body.classList.add("no-scroll")
    }
    else if (fullScreenActual == "flex") {
        fullScreenActual = "none"
        fullScreen.style.display = fullScreenActual
        document.body.classList.remove("no-scroll")
    }
    else {
        console.log("Display Alterado.")
    }
}