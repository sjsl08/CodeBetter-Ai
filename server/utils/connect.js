const mongoose = require("mongoose")

mongoose.set('strictQuery', true);

const connect_database = () => {
    console.log("hi");
    return mongoose.connect(process.env.DB_URI).then(() => {
        console.log("Database Connected");
    }).catch((e) => {
        console.log(e.messsgae);
    })
}

module.exports = connect_database;