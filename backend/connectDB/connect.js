const mongoose = require('mongoose');

const connectDB = (URI) => {
    return mongoose.connect(URI).then(() => {
        console.log("Dtabase is successfully connected.");
    }).catch((err) => {
        console.log("Something went wrong in databse.")
    })
}

module.exports = connectDB;
