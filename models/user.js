const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const Schema = mongoose.Schema;

// define model
// email is unique and must be sent to mongodb with lowercase
const userSchema = new Schema({
  email: {type: String, unique: true, lowercase: true},
  password: String
});

// On save Hook, encrypt password
userSchema.pre("save", function(next){ //called before .save()
  const user = this;
  bcrypt.genSalt(10, function(err, salt){ // generate salt
    if(err){
      return next(err);
    }
    bcrypt.hash(user.password, salt, null, function(err, hash){ //generate hash
      if(err){
        return next(err);
      }

      //replace plain text pw with the hash
      user.password = hash;
      next();
    })
  })
});

userSchema.methods.comparePassword = function(candidatePassword, callback){
  // bcrypt uses the candidatePassword and the stored salt (stored in db together with the hash pw)
  // to generate the hash of the candidatePassword and compare it with the hash stored in the DB
  bcrypt.compare(candidatePassword, this.password, function(error, isMatch){
    if(error){
      return callback(error);
    }

    callback(null, isMatch)
  })
}

// creaste the model class
const ModelClass = mongoose.model("user", userSchema); //collection named user

// export the model
module.exports = ModelClass;
