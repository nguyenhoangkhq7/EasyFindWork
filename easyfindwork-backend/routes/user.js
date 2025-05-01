const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");

router.get("/profile", userController.profile); // Gọi phương thức profile từ UserController

module.exports = router;
