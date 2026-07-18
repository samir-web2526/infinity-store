

const { getDB } = require("../config/db");

const getAllProducts = async (req, res) => {
    try {

        const db = getDB();

        const productsCollection = db.collection("products");

        const result = await productsCollection.find().toArray();

        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};

module.exports = {
    getAllProducts,
};