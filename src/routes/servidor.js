var express = require("express");
var router = express.Router();
const servidorController = require("../controllers/servidorController");

router.post("/ativarAgente", function(req, res) {
    servidorController.ativarAgente(req, res);
});

module.exports = router;

