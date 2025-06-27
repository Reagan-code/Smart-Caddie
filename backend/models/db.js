
const mongoose = require("mongoose");

module.exports = function connectToMongo() {

    try {
        mongoose.connect(process.env.MONGO_URL, connectionParams);
        console.log("connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
    }
};