
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const createProduct = async (req, res) => {
    try {
        const db = getDB();
        const productsCollection = db.collection("products");

        const {
            title,
            description,
            category,
            price,
            discountPercentage,
            stock,
            tags,
            brand,
            weight,
            dimensions,
            warrantyInformation,
            shippingInformation,
            returnPolicy,
            minimumOrderQuantity,
            images,
            thumbnail
        } = req.body;

        const newProduct = {
            title,
            description,
            category,
            price,
            discountPercentage,
            rating: 0,
            stock,
            tags,
            brand,
            sku: `SKU-${Date.now()}`,
            weight,

            dimensions: {
                width: dimensions?.width || null,
                height: dimensions?.height || null,
                depth: dimensions?.depth || null
            },

            warrantyInformation,
            shippingInformation,

            availabilityStatus: Number(stock) > 0
                ? "In Stock"
                : "Out of Stock",

            reviews: [],

            returnPolicy,
            minimumOrderQuantity,

            meta: {
                createdAt: new Date(),
                updatedAt: new Date(),
                barcode: "",
                qrCode: ""
            },

            images,
            thumbnail
        };

        const result = await productsCollection.insertOne(newProduct);

        res.status(201).send({
            message: "Product created successfully",
            insertedId: result.insertedId
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Internal Server Error"
        });
    }
};

const getAllProducts = async (req, res) => {

    try {
        const db = getDB();
        const productsCollection = db.collection("products");

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const search = req.query.search || "";
        const category = req.query.category || "";
        const brand = req.query.brand || "";
        const sort = req.query.sort || "";

        const skip = (page - 1) * limit;

        const query = {};

        if (search) {
            query.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    brand: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        if (category) {
            query.category = category;
        }

        if (brand) {
            query.brand = brand;
        }

        let sortOption = {};

        if (sort === "asc") {
            sortOption.price = 1;
        } else if (sort === "desc") {
            sortOption.price = -1;
        }

        const totalProducts = await productsCollection.countDocuments(query);

        const products = await productsCollection
            .find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .toArray();

        res.send({
            totalProducts,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
            products,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

const getSingleProduct = async (req, res) => {

    try {
        const { id } = req.params;

           if (!ObjectId.isValid(id)) {
            return res.status(400).send({
                message: "Invalid product id"
            });
        }

        const db = getDB();

        const productsCollection = db.collection("products");

        const query = { _id: new ObjectId(id) };

        const result = await productsCollection.findOne(query);

        if (!result) {
            return res.status(404).send({ message: "Product not found" });
        }

        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const db = getDB();

        const productsCollection = db.collection("products");

        const result = await productsCollection.updateOne(
            {
                _id: new ObjectId(id)
            },
            {
                $set:{
    ...req.body,
    "meta.updatedAt": new Date()
}
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).send({
                message: "Product not found"
            });
        }

        res.send({
            message: "Product updated successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Internal Server Error"
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const db = getDB();
        const productsCollection = db.collection("products");

        const result = await productsCollection.deleteOne({
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).send({
                message: "Product not found"
            });
        }

        res.send({
            message: "Product deleted successfully"
        });

    } catch (error) {
        console.log(error);

        res.status(500).send({
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct
};