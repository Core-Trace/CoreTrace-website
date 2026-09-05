var employeeModel = require("../models/employeeModel");

function searchEmployee(req, res) {
    let filtros = req.body.filters;
    let ordenacao = req.body.sort;
    let idEmpresaServer = req.body.empresaIdServer;

    if (filtros == undefined) {
        res.status(400).send("Filtros de busca estão undefined!");
    } else if (ordenacao == undefined) {
        res.status(400).send("Parâmetros de ordenação estão undefined!");
    } else if (idEmpresaServer == undefined) {
        res.status(400).send("ID da empresa está undefined!");
    } else {
        let srchName = filtros.srchName || "%%";
        let srchEmail = filtros.srchEmail || "%%";
        let srchPosition = filtros.srchPosition || "%%";

        let chckEmployee = ordenacao.chckEmployee || "ASC";
        let chckEmail = ordenacao.chckEmail || "ASC";
        let chckPosition = ordenacao.chckPosition || "ASC";
        // let chckData = ordenacao.chckData || "ASC"; // Dt. Admissão ainda não existe na tabela usuarios
        // let chckActivities = ordenacao.chckActivities || "ASC"; // Atividade ainda não existe no BD

        let marcadoEmployee = ordenacao.marcadoEmployee || false;
        let marcadoEmail = ordenacao.marcadoEmail || false;
        let marcadoPosition = ordenacao.marcadoPosition || false;

        employeeModel.searchEmployee(
            srchName,
            srchEmail,
            srchPosition,
            chckEmployee,
            chckEmail,
            chckPosition,
            // chckData,
            // chckActivities,
            marcadoEmployee,
            marcadoEmail,
            marcadoPosition,
            idEmpresaServer
        )
            .then(function (resultado) {
                res.json(resultado);
            })
            .catch(function (erro) {
                console.log(erro);
                console.log("Houve um erro ao buscar funcionários! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function catchServer(req, res) {
    let idUsuario = req.body.employeeId;

    if (idUsuario == undefined) {
        res.status(400).send("ID do funcionário está undefined!");
    } else {
        employeeModel.catchServer(idUsuario)
            .then(function (resultado) {
                res.json(resultado);
            })
            .catch(function (erro) {
                console.log(erro);
                console.log("Houve um erro ao buscar servidores do funcionário! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function revokeAccess(req, res) {
    let idUsuario = req.body.employeeId;
    let maquinas = req.body.maquinas; 

    if (idUsuario == undefined) {
        res.status(400).send("ID do funcionário está undefined!");
    } else if (maquinas == undefined || maquinas.length == 0) {
        res.status(400).send("Nenhuma máquina foi enviada para revogação!");
    } else {
        employeeModel.revokeAccess(idUsuario, maquinas)
            .then(function (resultado) {
                res.json(resultado);
            })
            .catch(function (erro) {
                console.log(erro);
                console.log("Houve um erro ao revogar acesso! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}



module.exports = {
    searchEmployee,
    catchServer,
    revokeAccess,
};