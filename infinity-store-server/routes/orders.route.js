const express = require("express");

const {
    createOrder,
    getMyOrders,
    getSingleOrder,
    updateOrderStatus
} = require("../controllers/orders.controller");

const validate = require("../middlewares/validate");
const verifyToken = require("../middlewares/verifyToken");
const verifyAdmin = require("../middlewares/verifyAdmin");

const {
    createOrderSchema,
    updateOrderStatusSchema
} = require("../validations/orders.validation");

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

router.get(
    "/:id",
    verifyToken,
    getSingleOrder
);

router.patch(
    "/:id/status",
    verifyToken,
    verifyAdmin,
    validate(updateOrderStatusSchema),
    updateOrderStatus
);

module.exports = router;