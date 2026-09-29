const express = require("express")
const conviteController = require("../controllers/criarconviteController")

const router = express.Router()

router.post("/criarConvite", conviteController.criarConvite)

module.exports = router;