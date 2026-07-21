const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const createOrder = async (req, res) => {
    try {
        const { paymentMethod, shippingAddress, deliveryArea } = req.body;

        const db = getDB();

        const cartsCollection = db.collection("carts");
        const productsCollection = db.collection("products");
        const ordersCollection = db.collection("orders");

        const cart = await cartsCollection.aggregate([
            {
                $match: {
                    userId: new ObjectId(req.user.id),
                },
            },
            {
                $unwind: "$items",
            },
            {
                $lookup: {
                    from: "products",
                    localField: "items.productId",
                    foreignField: "_id",
                    as: "product",
                },
            },
            {
                $unwind: "$product",
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
                            "$product.price",
                        ],
                    },
                },
            },
        ]).toArray();

        if (!cart.length) {
            return res.status(400).send({
                message: "Cart is empty",
            });
        }

        for (const item of cart) {
            const product = await productsCollection.findOne({
                _id: item.productId,
            });

            if (!product) {
                return res.status(404).send({
                    message: `${item.title} not found`,
                });
            }

            if (
                product.stock === 0 ||
                product.availabilityStatus === "Out of Stock"
            ) {
                return res.status(400).send({
                    message: `${item.title} is out of stock`,
                });
            }

            if (item.quantity > product.stock) {
                return res.status(400).send({
                    message: `Only ${product.stock} ${item.title} available in stock`,
                });
            }
        }

        const totalItems = cart.reduce(
            (sum, item) => sum + item.quantity,
            0
        );

        const totalPrice = cart.reduce(
            (sum, item) => sum + item.subtotal,
            0
        );

        const FREE_SHIPPING_THRESHOLD = 100;
        const SHIPPING_INSIDE_DHAKA = 1;
        const SHIPPING_OUTSIDE_DHAKA = 2;

        const isFreeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD;
        const shippingCost = isFreeShipping ? 0 : (deliveryArea === "inside_dhaka" ? SHIPPING_INSIDE_DHAKA : SHIPPING_OUTSIDE_DHAKA);
        const grandTotal = totalPrice + shippingCost;

        const order = {
            userId: new ObjectId(req.user.id),
            items: cart,
            totalItems,
            subtotal: totalPrice,
            shippingCost,
            deliveryArea,
            totalPrice: grandTotal,
            shippingAddress,
            paymentMethod,
            paymentStatus: "pending",
            orderStatus: "pending",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await ordersCollection.insertOne(order);

        await cartsCollection.deleteOne({
            userId: new ObjectId(req.user.id),
        });

        res.status(201).send({
            message: "Order placed successfully",
            insertedId: result.insertedId,
        });

    } catch (error) {
        console.log(error);

        res.status(500).send({
            message: "Internal Server Error",
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

const getAllOrders = async (req, res) => {
    try {
        const db = getDB();
        const ordersCollection = db.collection("orders");

        const orders = await ordersCollection
            .find({})
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

        const validStatuses = [
            "pending",
            "confirmed",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
        ];

        if (!validStatuses.includes(orderStatus)) {
            return res.status(400).send({
                message: "Invalid order status",
            });
        }

        const db = getDB();

        const ordersCollection = db.collection("orders");
        const productsCollection = db.collection("products");

        const order = await ordersCollection.findOne({
            _id: new ObjectId(id),
        });

        if (!order) {
            return res.status(404).send({
                message: "Order not found",
            });
        }

        if (
            orderStatus === "delivered" &&
            order.orderStatus !== "delivered"
        ) {
            for (const item of order.items) {
                const product = await productsCollection.findOne({
                    _id: item.productId,
                });

                if (!product) {
                    return res.status(404).send({
                        message: `${item.title} not found`,
                    });
                }

                if (product.stock < item.quantity) {
                    return res.status(400).send({
                        message: `${item.title} is out of stock`,
                    });
                }

                const newStock = product.stock - item.quantity;

                await productsCollection.updateOne(
                    {
                        _id: item.productId,
                    },
                    {
                        $set: {
                            stock: newStock,
                            availabilityStatus:
                                newStock > 0
                                    ? "In Stock"
                                    : "Out of Stock",
                        },
                    }
                );
            }
        }

        await ordersCollection.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: {
                    orderStatus,
                    updatedAt: new Date(),
                },
            }
        );

        res.send({
            message: "Order status updated successfully",
        });

    } catch (error) {
        console.log(error);

        res.status(500).send({
            message: "Internal Server Error",
        });
    }
};

const cancelOrder = async (req, res) => {
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

        if (order.orderStatus !== "pending") {
            return res.status(400).send({
                message: "Only pending orders can be cancelled"
            });
        }

        await ordersCollection.updateOne(
            {
                _id: new ObjectId(id)
            },
            {
                $set: {
                    orderStatus: "cancelled",
                    updatedAt: new Date()
                }
            }
        );

        res.send({
            message: "Order cancelled successfully"
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
    getAllOrders,
    getSingleOrder,
    updateOrderStatus,
    cancelOrder,
};