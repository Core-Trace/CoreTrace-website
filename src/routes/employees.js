var express = require("express");
var router = express.Router();
var employeeController = require("../controllers/employeeController");

router.post("/search", employeeController.searchEmployee);
router.post("/catchServer", employeeController.catchServer);
router.post("/revokeAccess", employeeController.revokeAccess);

module.exports = router;