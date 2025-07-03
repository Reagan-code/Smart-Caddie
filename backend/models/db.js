
const mongoose = require("mongoose");

module.exports = function Mongo() {

    try {
        mongoose.connect(process.env.MONGO_URL);
        console.log("connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
    }
};