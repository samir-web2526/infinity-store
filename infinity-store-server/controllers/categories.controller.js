const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

const getAllCategories = async (req, res) => {

    try {

        const db = getDB();

        const categoriesCollection = db.collection("categories");

        const categories = await categoriesCollection.find({}).toArray();

        res.send(categories);

    } catch (error) {

        console.log(error);

        res.status(500).send({
            message: "Internal Server Error"
        });
    }
};

const getSingleCategory = async (req, res) => {

    try {

        const { id } = req.params;

        const db = getDB();

        const categoriesCollection = db.collection("categories");

        const category = await categoriesCollection.findOne({
            _id: new ObjectId(id)
        });


        if (!category) {
            return res.status(404).send({
                message: "Category not found"
            });
        }

        res.send(category);

    } catch (error) {

        console.log(error);

        res.status(500).send({
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    getAllCategories,
    getSingleCategory
};