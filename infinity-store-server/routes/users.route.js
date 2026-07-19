const express = require("express");

const {
    getAllUsers,
    getProfile
} = require("../controllers/users.controller");

const verifyToken = require("../middlewares/verifyToken");
const verifyAdmin = require("../middlewares/verifyAdmin");

const router = express.Router();

router.get("/", verifyToken, verifyAdmin, getAllUsers);

router.get("/profile", verifyToken, getProfile);

module.exports = router;