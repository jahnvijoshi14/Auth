require("dotenv").config();
const profile = require("./config/enviroment");
const express = require("express");

const app = express();
const port = process.env.PORT || 8000;
const expressLayouts = require("express-ejs-layouts");

const db = require("./config/mongoose");

const mongoose = require("mongoose");

const User = require("./models/user");
const session = require("express-session");

const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportGoogle = require("./config/passport-google-oauth");
const MongoStore = require("connect-mongo")(session);

// connect to cloud database

// if (profile.name === "prod") {
//   mongoose.set("strictQuery", false);
//   db = async () => {
//     try {
//       const conn = await mongoose.connect(process.env.MONGO_URI);
//       console.log(`MongoDB Connected: ${port}`);
//     } catch (error) {
//       console.log(error);
//       process.exit(1);
//     }
//   };
// }

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    // store: new MongoStore(
    //   {
    //     mongooseConnection: db,
    //     autoRemove: "disabled",
    //   },
    //   function (err) {
    //     console.log(err || "connect-mongodb setup ok");
    //   }
    // ),
  })
);

app.use(passport.initialize());
app.use(passport.session());

//const hashing = require("./config/hashing");

app.use(express.urlencoded());

app.use(express.static("./assets"));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// set up the view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// use express router
app.use("/", require("./routes/index"));
passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(async function (id, cb) {
  try {
    let user = await User.findById(id);
    cb(null, user);
  } catch (err) {
    console.log("Error in finding user --> Passport");
    return cb(err);
  }
});

if (profile.name === "dev") {
  app.listen(port, (err) => {
    if (err) {
      console.log(`Error in running the server: ${err}`);
      return;
    }

    console.log(`Server is running on port: ${port}`);
  });
}

// this is for deployment
// if (profile.name === "prod") {
//   db().then(() => {
//     app.listen(port, (err) => {
//       if (err) {
//         console.log(`Error in running the server: ${err}`);
//         return;
//       }

//       console.log(`Server is running on port: ${port}`);
//     });
//   });
// }
