require("dotenv").config();
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

MongoClient.connect(process.env.MONGO_DB_URL)
  .then()
  .catch((err) => {
    console.log(err);
  });
