const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({path: "./.env"});

const DB = process.env.DB.replace(
    "<password>",
    process.env.PASSWORD
);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(DB);
        console.log(`Connected to MongoDB: ${conn.connection.host}`.cyan.underline)

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = {
    connectDB,
}