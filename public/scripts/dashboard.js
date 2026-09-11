getPapel()
async function getPapel(){
    const emailUsuario = sessionStorage.EMAIL_USUARIO
    const idUsuario = sessionStorage.ID_USUARIO
    
    const response = await fetch("/employee/getPapel", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usuarioId: idUsuario,
                usuarioEmail: emailUsuario
            })
        })

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
        }

        const papel = await response.json()
        console.log(papel)
        gerarAside(papel)
}
let cadastrarFunc = document.getElementById("CadastrarFuncionario")
let verFunc = document.getElementById("VerFuncionarios")
function gerarAside(papel){
    console.log(papel[0]["papel"])
    if(papel[0]["papel"] != 1){
        cadastrarFunc.style.display="none";
        verFunc.style.display="none";
    }
}