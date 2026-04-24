const express = require("express");
const router = express.Router();
const ANish = require("../controllers/controller.js");

router.route("/getanish").get(ANish);

module.exports = router;
