// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20");

// const User = require("../model/User");

// passport.use(
//   new GoogleStrategy(
//     {
//       callbackURL: "/auth/google/redirect",
//       clientID: process.env.CLIENT_ID,
//       clientSecret: process.env.CLIENT_SECRET,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       //   call back functon
//       console.log("call back function fired");
//       const newUser = new User({
//         googleId: profile.id,
//         displayName: profile.displayName,
//         familyName: profile.name.familyName,
//         givenName: profile.name.givenName,
//         image: profile.photos[0].value,
//       });
//       const saveUser = await newUser.save();
//       console.log(profile);
//     }
//   )
// );

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const User = require("../model/User");

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "/auth/google/redirect",
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          familyName: profile.name.familyName,
          givenName: profile.name.givenName,
          image: profile.photos[0].value,
        };

        try {
          let user = await User.findOne({ googleId: profile.id });
          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.log(err);
        }
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
