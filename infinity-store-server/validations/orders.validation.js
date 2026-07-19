const { z } = require("zod");

const createOrderSchema = z.object({
    paymentMethod: z.enum(
        ["Cash on Delivery"],
        {
            error: "Only Cash on Delivery is supported"
        }
    ),

    shippingAddress: z.object({
        fullName: z.string().min(2, "Full name is required"),
        phone: z.string().min(11, "Phone number is required"),
        address: z.string().min(5, "Address is required"),
        city: z.string().min(2, "City is required"),
        postalCode: z.string().min(3, "Postal code is required")
    })
});

const updateOrderStatusSchema = z.object({
    orderStatus: z.enum(
        ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
        {
            error: "Invalid order status"
        }
    )
});

module.exports = {
    createOrderSchema,
    updateOrderStatusSchema
};