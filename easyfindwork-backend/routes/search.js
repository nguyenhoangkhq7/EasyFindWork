const express = require("express");
const router = express.Router();
const searchController = require("../controllers/SearchController");

router.get("/", searchController.index); // Gọi phương thức index từ SearchController

module.exports = router;
