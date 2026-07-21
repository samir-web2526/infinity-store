const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();

const { connectDB } = require("./config/db");

const productRoutes = require("./routes/products.route");
const categoryRoutes = require("./routes/categories.route");
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/users.route");
const cartRoutes = require("./routes/cart.route");
const orderRoutes = require("./routes/orders.route");

const app = express();
const port = process.env.PORT || 5000;

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true
    })
);

app.use(express.json());
app.use(cookieParser());

if (process.env.VERCEL) {
    app.use(async (req, res, next) => {
        try {
            await connectDB();
            next();
        } catch (error) {
            res.status(500).json({ message: "Database connection failed" });
        }
    });
}

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
    res.send("Infinity Store Server is Running...");
});

if (process.env.VERCEL) {
    module.exports = app;
} else {
    startServer();
}

async function startServer() {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.log(error);
    }
}
