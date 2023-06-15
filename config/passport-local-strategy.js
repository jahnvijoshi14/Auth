const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;
const hashing = require("../config/hashing");

const User = require("../models/user");

// authentication using passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    async function (req, email, password, done) {
      // find a user and establish the identity
      try {
        let user = await User.findOne({ email: email });

        if (!user || hashing.decrypt(user.password) != password) {
          return done(null, false);
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// // serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// deserializing the user from the key in the cookies
passport.deserializeUser(async function (id, cb) {
  try {
    let user = await User.findById(id);
    cb(null, user);
  } catch (err) {
    console.log("Error in finding user --> Passport");
    return cb(err);
  }
});

// check if the user is authenticated
passport.checkAuthentication = function (req, res, next) {
  // if the user is signed in, then pass on the request to the next function(controller's action)
  if (req.isAuthenticated()) {
    return next();
  }

  // if the user is not signed up
  return res.redirect("/login-page");
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
    res.locals.user = req.user;
    //Console.log(res.locals.user + "jjswdj");
  }

  next();
};

module.exports = passport;
