const User = require("../models/user");

exports.signup = function(req, res, next){
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email: email}, function(error, existingUser){
    if(error) {
      return next(error)
    }

    if(existingUser){
      return res.status(422).send({error: "Email is already in use"});
    }

    // creates a representation of the user
    const user = new User({
      email: email,
      password: password
    });

    //save user in the db
    user.save(function(error){
      if(error){
        return next(error);
      }

      res.json(user);
    });

  });

}
