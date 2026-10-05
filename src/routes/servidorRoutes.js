const express = require("express");
const router = express.Router();
const servidorController = require("../controllers/servidorController");

router.post("/ativarAgente", servidorController.ativarAgente);

module.exports = router;
