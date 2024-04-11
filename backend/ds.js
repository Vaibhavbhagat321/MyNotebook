const mongoose = require("mongoose");
require("dotenv").config();

const mongoURI = process.env.MONGO_URI.replace(
  "<password>",
  process.env.MONGO_PASSWORD
);

const connnectToMongo = () => {
  mongoose.set("strictQuery", false);
  mongoose.connect(mongoURI, () => {
    console.log("Connected to mongo...");
  });
};

module.exports = connnectToMongo;
