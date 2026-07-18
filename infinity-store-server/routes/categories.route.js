const express = require("express");

const { getAllCategories, getSingleCategory } = require("../controllers/categories.controller");

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:id", getSingleCategory);

module.exports = router;