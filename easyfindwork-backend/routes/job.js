const express = require("express");
const router = express.Router();
const jobController = require("../controllers/JobController");

router.get("/:id", jobController.detail); // Gọi phương thức detail từ JobController

module.exports = router;
