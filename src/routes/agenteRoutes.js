const express = require("express");
const router = express.Router();
const agenteController = require("../controllers/agenteController");

router.post("/download", agenteController.baixar);

module.exports = router;
