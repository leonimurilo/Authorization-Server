const Authentication = require("./controllers/authentication");
const passportService = require("./services/passport");
const passport = require("passport");

// create authentication middleware
// disable passport default cookie based session
const requireAuth = passport.authenticate("jwt", {session: false});
const requireSignin = passport.authenticate("local", {session: false});

module.exports = function(app){
  app.get("/", requireAuth, function(req, res){
    res.send({message: "ABC123"})
  });
  app.post("/signin", requireSignin, Authentication.signin);
  app.post("/signup", Authentication.signup);
}
