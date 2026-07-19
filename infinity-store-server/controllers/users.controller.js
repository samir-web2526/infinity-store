const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

const getAllUsers = async (req, res) => {
    try {
        const db = getDB();

        const usersCollection = db.collection("users");

        const users = await usersCollection.find(
            {},
            {
                projection: {
                    password: 0
                }
            }
        ).toArray();

        res.status(200).send({
            totalUsers: users.length,
            users
        });

    } catch (error) {
        console.log(error);

        res.status(500).send({
            message: "Internal Server Error"
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const db = getDB();

        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne(
            {
                _id: new ObjectId(req.user.id)
            },
            {
                projection: {
                    password: 0
                }
            }
        );

        if (!user) {
            return res.status(404).send({
                message: "User not found"
            });
        }

        res.send(user);

    } catch (error) {
        console.log(error);

        res.status(500).send({
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    getAllUsers,
    getProfile
};