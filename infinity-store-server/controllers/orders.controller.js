const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const createOrder = async (req, res) => {
    try {
        const { paymentMethod, shippingAddress } = req.body;

        const db = getDB();

        const cartsCollection = db.collection("carts");
        const ordersCollection = db.collection("orders");

        const cart = await cartsCollection.aggregate([
            {
                $match: {
                    userId: new ObjectId(req.user.id)
                }
            },
            {
                $unwind: "$items"
            },
            {
                $lookup: {
                    from: "products",
                    localField: "items.productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $unwind: "$product"
            },
            {
                $project: {
                    productId: "$product._id",
                    title: "$product.title",
                    thumbnail: "$product.thumbnail",
                    price: "$product.price",
                    quantity: "$items.quantity",
                    subtotal: {
                        $multiply: [
                            "$items.quantity",
                            "$product.price"
                        ]
                    }
                }
            }
        ]).toArray();

        if (!cart.length) {
            return res.status(400).send({
                message: "Cart is empty"
            });
        }

        const totalItems = cart.reduce(
            (sum, item) => sum + item.quantity,
            0
        );

        const totalPrice = cart.reduce(
            (sum, item) => sum + item.subtotal,
            0
        );

        const order = {
            userId: new ObjectId(req.user.id),
            items: cart,
            totalItems,
            totalPrice,
            shippingAddress,
            paymentMethod,
            paymentStatus: "pending",
            orderStatus: "pending",
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await ordersCollection.insertOne(order);

        await cartsCollection.deleteOne({
            userId: new ObjectId(req.user.id)
        });

        res.status(201).send({
            message: "Order placed successfully",
            insertedId: result.insertedId
        });

    } catch (error) {
        console.log(error);

        res.status(500).send({
            message: "Internal Server Error"
        });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const db = getDB();

        const ordersCollection = db.collection("orders");

        const orders = await ordersCollection
            .find({
                userId: new ObjectId(req.user.id)
            })
            .sort({
                createdAt: -1
            })
            .toArray();

        res.send({
            totalOrders: orders.length,
            orders
        });

    } catch (error) {
        console.log(error);

        res.status(500).send({
            message: "Internal Server Error"
        });
    }
};

const getSingleOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const db = getDB();
        const ordersCollection = db.collection("orders");

        const order = await ordersCollection.findOne({
            _id: new ObjectId(id)
        });

        if (!order) {
            return res.status(404).send({
                message: "Order not found"
            });
        }

        const isOwner = order.userId.toString() === req.user.id;
        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).send({
                message: "Forbidden"
            });
        }

        res.send(order);

    } catch (error) {
        console.log(error);

        res.status(500).send({
            message: "Internal Server Error"
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { orderStatus } = req.body;

        const db = getDB();
        const ordersCollection = db.collection("orders");

        const result = await ordersCollection.updateOne(
            {
                _id: new ObjectId(id)
            },
            {
                $set: {
                    orderStatus,
                    updatedAt: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).send({
                message: "Order not found"
            });
        }

        res.send({
            message: "Order status updated successfully"
        });

    } catch (error) {
        console.log(error);

        res.status(500).send({
            message: "Internal Server Error"
        });
    }
};



module.exports = {
    createOrder,
    getMyOrders,
    getSingleOrder,
    updateOrderStatus
};