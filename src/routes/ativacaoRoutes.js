const express = require("express")
const ativacaoController = require("../controllers/ativacaoController")

const router = express.Router()

router.get("/", ativacaoController.ativar)
router.post("/", ativacaoController.concluirAtivacao)

module.exports = router
