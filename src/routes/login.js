const express = require("express");
const router = express.Router();

const loginController = require("../controllers/loginController");

router.post("/auth", function (req, res) {
    loginController.autenticar(req, res);
});

router.post("/register", function (req, res) {
    loginController.cadastrar(req, res);
});

router.post("/getSectors", function(req,res){
    loginController.getSectors(req,res)
});
router.post("/getMachines", function(req,res){
    loginController.getMachines(req,res)
});

router.post("/acessos", function(req, res){
    loginController.criarAcessos(req, res);
});
router.get("/acessos/:usuario", function(req, res){
    loginController.listarAcessos(req, res);
});
router.put("/acessos/revogar", function(req, res){
    loginController.revogarAcesso(req, res);
});


module.exports = router;
