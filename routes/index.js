const express = require("express");
const signupController = require("../controller/singupController");
const passport = require("passport");

const router = express.Router();

router.get("/", signupController.home);
router.get("/signup", signupController.signup);
router.get("/login-page", signupController.loginPage);
router.get("/welcome", signupController.welcome);
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/signup",
    successRedirect: "/authenticated",
  })
);

router.get(
  "/authenticated",
  passport.checkAuthentication,
  signupController.login
);

router.get("/logout", passport.checkAuthentication, signupController.logout);

router.get(
  "/change-password-page",
  passport.checkAuthentication,
  signupController.changePasswordPage
);

router.post(
  "/change-password",
  passport.checkAuthentication,
  signupController.changePassword
);

router.post("/register", signupController.register);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    accessType: "offline",
    prompt: "consent",
  })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/signup",
    successRedirect: "/welcome",
  })
  //signupController.createSession
);

module.exports = router;
