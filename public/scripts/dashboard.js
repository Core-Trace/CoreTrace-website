let cadastrarFunc = document.getElementById("CadastrarFuncionario")
let verFunc = document.getElementById("VerFuncionarios")


function gerarAside(papel){
    console.log(papel[0]["papel"])
    if(papel[0]["papel"] != 1){
        cadastrarFunc.style.display="none";
        verFunc.style.display="none";
    }
}

gerarAside(sessionStorage.ID_PAPEL)


