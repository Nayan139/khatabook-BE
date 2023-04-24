const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/users");
const { signup } = require("./controller/authController");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      let hashedPassword = await bcrypt.hash("Test@123", 12);
      const userInfo = new User({
        firstname: profile.name.familyName ?? "Firstname",
        lastname: profile.name.givenName ?? "Lastname",
        email: profile.emails[0].value,
        password: hashedPassword,
      });

      const isExisiting = await User.findOne({ email: userInfo.email });
      let token;
      if (!isExisiting) {
        userInfo.save();
        // created token
        token = jwt.sign(
          {
            id: userInfo._id,
            name: `${userInfo.firstname} ${userInfo.lastname}`,
            email: userInfo.email,
          },
          process.env.SECRET,
          {
            expiresIn: process.env.EXPIRE_TOKEN,
          }
        );
      } else {
        // created token
        token = jwt.sign(
          {
            id: isExisiting._id,
            name: `${isExisiting.firstname} ${isExisiting.lastname}`,
            email: isExisiting.email,
          },
          process.env.SECRET,
          {
            expiresIn: process.env.EXPIRE_TOKEN,
          }
        );
      }
      return done(null, `Bearer ${token}`);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
