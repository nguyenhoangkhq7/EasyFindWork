const express = require("express");
const router = express.Router();
const homeController = require("../controllers/HomeController");

router.use("/", homeController.index);

module.exports = router;
