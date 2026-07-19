const { z } = require("zod");

const registerSchema = z.object({
    name: z
        .string()
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name cannot exceed 50 characters"),

    email: z
        .email("Invalid email address")
        .transform(email => email.trim().toLowerCase()),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),

    profilePhoto: z
        .string()
        .optional()
        .default(""),

    phone: z
        .string()
        .optional()
        .default(""),

    address: z
        .string()
        .optional()
        .default("")
});

const loginSchema = z.object({
    email: z
        .email("Invalid email address")
        .transform(email => email.trim().toLowerCase()),

    password: z
        .string()
        .min(1, "Password is required")
});

module.exports = {
    registerSchema,
    loginSchema
};