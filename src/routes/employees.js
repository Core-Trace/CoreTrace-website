var express = require("express");
var router = express.Router();
var employeeController = require("../controllers/employeeController");

router.post("/search", employeeController.searchEmployee);
router.post("/catchServer", employeeController.catchServer);

module.exports = router;