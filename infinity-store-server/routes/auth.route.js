const express = require("express");

const {
    register,
    login,
    logout,
    refreshToken
} = require("../controllers/auth.controller");

const validate = require("../middlewares/validate");

const {
    registerSchema,
    loginSchema
} = require("../validations/auth.validation");

const router = express.Router();

router.post(
    "/register",
    validate(registerSchema),
    register
);

router.post(
    "/login",
    validate(loginSchema),
    login
);

router.post(
    "/logout",
    logout
);

router.post("/refresh-token", refreshToken);

module.exports = router;