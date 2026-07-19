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

async function startServer() {
    try {
        await connectDB();

        app.use("/api/auth", authRoutes);
        app.use("/api/users", userRoutes);
        app.use("/api/products", productRoutes);
        app.use("/api/categories", categoryRoutes);
        app.use("/api/cart", cartRoutes);

        app.get("/", (req, res) => {
            res.send("Infinity Store Server is Running...");
        });

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });

    } catch (error) {
        console.log(error);
    }
}

startServer();