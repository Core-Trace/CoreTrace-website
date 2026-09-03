const express = require("express");
const router = express.Router();

const loginController = require("../controllers/loginController");

router.post("/auth", function (req, res) {
    loginController.autenticar(req, res);
});

router.post("/register", function (req, res) {
    loginController.cadastrar(req, res);
});

router.post("/validar-passkey", function (req, res) {
    loginController.validarPasskey(req, res);
});

module.exports = router;
