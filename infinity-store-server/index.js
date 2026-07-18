const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const { connectDB } = require("./config/db");
const productRoutes = require("./routes/products.route");
const categoryRoutes = require("./routes/categories.route");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

async function startServer() {
    try {
        await connectDB();

        app.use("/products", productRoutes);
        app.use("/categories", categoryRoutes);

        app.get("/", (req, res) => {
            res.send("Infinity Store Server is Running...");
        });

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (err) {
        console.log(err);
    }
}

startServer();