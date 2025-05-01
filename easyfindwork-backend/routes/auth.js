const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthController");

router.post("/login", authController.login); // Gọi phương thức login từ AuthController
router.post("/register", authController.register); // Gọi phương thức register từ AuthController

module.exports = router;
