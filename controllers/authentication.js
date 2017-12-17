const User = require("../models/user");
const jwt = require("jwt-simple");
const config = require("../config");

function tokenForUser(user){
  // json web token (JWT) conventions:
  // subject (sub) property = who is this token belongs to
  // issued at time (iat) = when the token was generated
  // all about JWT: https://jwt.io
  const timestamp = new Date().getTime();
  return jwt.encode({sub: user.id, iat: timestamp}, config.secret);
  // the token can be decoded using the secret and then we get back the user id and timestamp
}

// user already signed in, we just need to give them a token
exports.signin = function(req, res, next){
  // since this request has passed through LocalStrategy
  // it will receive the user (inside req) which was sent via done() function in passport.js
  res.send({token: tokenForUser(req.user)});
}

exports.signup = function(req, res, next){
  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password){
    return res.status(422).send({error: "You must provide email and password"});
  }

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

      res.json({token: tokenForUser(user)});
    });

  });

}
