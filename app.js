const express = require("express");
const router = require("./routes/google");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");

const passportSetup = require("./config/passport-setup");

const app = express();

require("./config/passport-setup")(passport);

app.set("view engine", "ejs");
app.set("views", "views");

// sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGOOSE_URI, { useNewUrlParser: true }, () => {
  console.log("Mongo DB connected");
});
app.use("/", router);
app.get("/logout", (req, res) => res.send("Logged out"));

app.listen(3000, () => {
  console.log("server running");
});
