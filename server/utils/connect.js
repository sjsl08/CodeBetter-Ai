const mongoose = require("mongoose")

mongoose.set('strictQuery', true);

const connect_database = async () => {
    console.log("hi");
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("Database Connected");
    } catch (e) {
        console.log(e.messsgae);
    }
}

module.exports = connect_database;