const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/userModel");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/api/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const mode = req.query.state || "login"; 
        let user = await User.findOne({ googleId: profile.id });

        if (mode === "login") {
          if (!user) return done(null, false); 
        } else if (mode === "signup") {
          if (!user) {
            user = await User.create({
              googleId: profile.id,
              email: profile.emails[0].value,
              fullName: {
                firstName: profile.name.givenName || "",
                lastName: profile.name.familyName || "",
              },
              provider: "google",
              isVerified: true,
              profilePic: profile.photos[0]?.value || "",
            });
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/api/auth/github/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const mode = req.query.state || "login";
        let user = await User.findOne({ githubId: profile.id });

        if (mode === "login") {
          if (!user) return done(null, false);
        } else if (mode === "signup") {
          if (!user) {
            user = await User.create({
              githubId: profile.id,
              email: profile.emails?.[0]?.value || "",
              fullName: {
                firstName: profile.displayName?.split(" ")[0] || "",
                lastName: profile.displayName?.split(" ")[1] || "",
              },
              provider: "github",
              isVerified: true,
              profilePic: profile.photos?.[0]?.value || "",
            });
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
