const express = require("express");
// Creation of the router.
const router = express.Router();

/*
Middleware
*/

const validate = require("../middleware/joi");

/*
Controller
*/

const userCtrl = require("../controllers/users");

/*
Routes
*/

router.post("/signup", validate.user, userCtrl.signup);
router.post("/login", validate.user, userCtrl.login);

module.exports = router;
