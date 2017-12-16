const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// define model
// email is unique and must be sent to mongodb with lowercase
const userSchema = new Schema({
  email: {type: String, unique: true, lowercase: true},
  password: String
});

// creaste the model class
const ModelClass = mongoose.model("user", userSchema); //collection named user

// export the model
module.exports = ModelClass;
