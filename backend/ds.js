const mongoose = require("mongoose");
require("dotenv").config();

const mongoURI = process.env.MONGO_URI;

const connnectToMongo = () => {
  mongoose.connect(mongoURI, () => {
    console.log("Connected to mongo...");
  }); 
};

module.exports = connnectToMongo;
