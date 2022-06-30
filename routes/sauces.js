const express = require("express");
// Creation of the router.
const router = express.Router();

/*
Middlewares
*/

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const validate = require("../middleware/joi");

/*
Controllers 
*/

const saucesCtrl = require("../controllers/sauces");

/*
Routes
*/

router.get("/", auth, saucesCtrl.getAllSauces);
router.post("/", auth, multer, validate.sauce, saucesCtrl.createSauce);
router.get("/:id", auth, validate.id, saucesCtrl.getOneSauce);
router.put(
  "/:id",
  auth,
  multer,
  validate.id,
  validate.sauce,
  saucesCtrl.modifySauce
);
router.delete("/:id", auth, validate.id, saucesCtrl.deleteSauce);
router.post(
  "/:id/like",
  auth,
  validate.id,
  validate.like,
  saucesCtrl.likeDislike
);

module.exports = router;
