const user = require("../models/user");
const hashing = require("../config/hashing");

//this is the home or welcome page
module.exports.home = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/welcome");
  }
  res.render("home", { User: req.user });
};

//this is registeration page
module.exports.signup = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/welcome");
  }
  res.render("signup", { User: req.user, message: "" });
};

//this is login page
module.exports.loginPage = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/welcome");
  }
  res.render("login", { User: req.user, message: "" });
};

//this is change password page
module.exports.changePasswordPage = (req, res) => {
  res.render("change-password", { User: req.user, error: "" });
};

//this is for logout
module.exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

//this is logic to change password
module.exports.changePassword = async (req, res) => {
  try {
    const data = await user.find({ email: req.user.email });

    const oldpassword = hashing.decrypt(data[0].password);

    if (req.body.oldpassword == oldpassword) {
      const updated = await user.findByIdAndUpdate(data[0]._id, {
        password: hashing.encrypt(req.body.newpassword),
      });

      return res.redirect("/welcome");
    }
    res.render("change-password", {
      error: "Incorrect old password!!!!",
      User: req.user,
    });
  } catch (err) {
    res.render("change-password", {
      error: "Something Went Wrong!!!",
      User: req.user,
    });
  }
};

module.exports.login = async (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/welcome");
  }
  return res.render("login", {
    User: req.user,
    message: "Incorrect email or password",
  });
  //let email = req.body.email;
  // let password = req.body.password;
  // try {
  //   let data = await user.find({ email: email });
  //   console.log(data[0].name);
  //   if (data && data.length) {
  //     let decrypedPassword = hashing.decrypt(data[0].password);
  //     //console.log(decrypedPassword);
  //     if (decrypedPassword == password) {
  //       req.user = data;
  //       return res.render("welcome", { User: { name: data[0].name } });
  //     } else {
  //       res.render("login", {
  //         User: "",
  //         message: "Incorrect Password/Email",
  //       });
  //     }
  //   } else {
  //     res.render("login", {
  //       User: "",
  //       message: "Email does not exist. Please sign up!!!!",
  //     });
  //   }
  // } catch (err) {
  //   console.log(err);
  //   res.render("login", {
  //     User: "",
  //     message: "Incorrect Password/Email",
  //   });
  // }
};

//this will add data to db
module.exports.register = async (req, res) => {
  let data = req.body;
  let password = hashing.encrypt(data.password);
  data.password = password;
  //if the email is already in db then we cannot sign again with that id
  const anyUser = await user.find({ email: req.body.email });
  console.log(anyUser);
  if (anyUser && anyUser.length > 0) {
    res.render("signup", { User: req.user, message: "Email Already Exist" });
  } else {
    let createdUser = await user.create(data);

    res.redirect("/login-page");
  }
};

// module.exports.createSession = (req, res) => {
//   res.render("welcome", { User: req.user });
// };

module.exports.welcome = (req, res) => {
  res.render("welcome", { User: req.user });
};
