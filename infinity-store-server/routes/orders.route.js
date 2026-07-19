const express = require("express");

const {
    createOrder,
    getMyOrders
} = require("../controllers/orders.controller");

const validate = require("../middlewares/validate");
const verifyToken = require("../middlewares/verifyToken");

const { createOrderSchema } = require("../validations/orders.validation");

const router = express.Router();

router.post(
    "/",
    verifyToken,
    validate(createOrderSchema),
    createOrder
);

router.get(
    "/",
    verifyToken,
    getMyOrders
);

module.exports = router;