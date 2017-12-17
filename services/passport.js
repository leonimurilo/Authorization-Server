const passport = require("passport");
const User = require("../models/user");
const config = require("../config");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");

 // strategy = method for authenticating a user

// create local strategy
// receive email and password instead of token
const localOptions = {usernameField: "email"};
const localLogin = new LocalStrategy(localOptions, function(email, password, done){
  if(!email || !password){
    return done({error: "Username and password must be provided."});
  }
  User.findOne({email: email}, function(error, user){
    if(error){
      return done(error);
    }

    if(!user){
      return done(null, false);
    }

    // compare passwords
    user.comparePassword(password, function(error, isMatch){
      if(error){
        return done(error);
      }

      if(!isMatch){
        return done(null, false);
      }

      return done(null, user);

    })

  });
});


// setup options for JWT strategy
// tells JwtStrategy where to look for the token in the request
// in this case it will look at the header param called authorization
// also pass the secret to decode the token
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: config.secret
};

// create JWT strategy
// payload will be the decoded jwt token
// done is a function that we call depending on when or not we are able to authenticate the user
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
  // see if the user id in the payload exists in the db
  User.findById(payload.sub, function(error, user){
    // error on searching
    if(error) {
      return done(error, false);
    }

    // didn't find user
    if(!user){
      return done(null, false);
    }

    return done(null, user);
  });
});

// tell passport to use the strategy
passport.use(jwtLogin);
passport.use(localLogin);
