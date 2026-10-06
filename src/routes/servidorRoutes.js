const express = require("express");
const router = express.Router();
const servidorController = require("../controllers/servidorController");

router.post("/ativarAgente", servidorController.ativarAgente);
router.get("/perfis", servidorController.listarPerfis);

module.exports = router;
