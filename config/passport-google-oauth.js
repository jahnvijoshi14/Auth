const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");

const User = require("../models/user");
const API = "auth/google/callback";

// tell passport to use a new strategy for google login
passport.use(
  new googleStrategy(
    {
      //   authorizationURL: "https://accounts.google.com/o/oauth2/auth",
      //   tokenURL: "https://accounts.google.com/o/oauth2/token",
      clientID:
        "317523163674-nrcjbd0oatfpdtrp28r638tp4cok0j7j.apps.googleusercontent.com",
      clientSecret: "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",
      //   callbackURL: "http://localhost:8000/auth/google/callback",
      callbackURL: `http://localhost:8000/${API}`,
    },

    async function (accessToken, refreshToken, profile, done) {
      // find a user
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        console.log(accessToken, refreshToken);
        console.log(profile);

        if (user) {
          // if found, set this user as req.user
          return done(null, user);
        } else {
          // if not found, create the user and set it as req.user
          let user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: crypto.randomBytes(20).toString("hex"),
          });

          return done(null, user);
        }
      } catch (err) {
        console.log(`err  in fun ${err}`);
        return done(err);
      }
    }
  )
);

module.exports = passport;