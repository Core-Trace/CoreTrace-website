let fullScreen = document.getElementById("fullScreen")
fullScreen.style.display="none"
let fullScreenActual = "none"
function asidePlot(){
    console.log(fullScreen)
    if(fullScreenActual == "none"){
        fullScreenActual = "block"
        fullScreen.style.display = fullScreenActual

    }
    else if(fullScreenActual == "block"){
        fullScreenActual = "none"
        fullScreen.style.display = fullScreenActual
    }
    else{
        console.log("Display Alterado.")
    }
}