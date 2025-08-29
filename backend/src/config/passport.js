const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const DiscordStrategy = require("passport-discord").Strategy;
const User = require("../models/userModel");

const BACKEND_URL = process.env.RENDER_BACKEND_URL || "http://localhost:4000";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${BACKEND_URL}/api/auth/google/callback`,
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
      callbackURL: `${BACKEND_URL}/api/auth/github/callback`,
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

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: `${BACKEND_URL}/api/auth/facebook/callback`,
      profileFields: ["id", "emails", "name", "picture.type(large)"],
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const mode = req.query.state || "login";
        let user = await User.findOne({ facebookId: profile.id });

        if (!user) {
          if (mode === "login") {
            return done(null, false); 
          } else if (mode === "signup") {
            user = await User.create({
              facebookId: profile.id,
              email: profile.emails?.[0]?.value || "",
              fullName: {
                firstName: profile.name?.givenName || "",
                lastName: profile.name?.familyName || "",
              },
              provider: "facebook",
              isVerified: true,
              profilePic: profile.photos?.[0]?.value || "",
            });
            return done(null, user); 
          }
        } else {
          return done(null, user);
        }
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: `${BACKEND_URL}/api/auth/discord/callback`,
      scope: ["identify", "email"], 
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const mode = req.query.state || "login";
        let user = await User.findOne({ discordId: profile.id });

        if (mode === "login") {
          if (!user) return done(null, false);
        } else if (mode === "signup") {
          if (!user) {
            user = await User.create({
              discordId: profile.id,
              email: profile.email,
              fullName: {
                firstName: profile.username || "",
                lastName: "",
              },
              provider: "discord",
              isVerified: true,
              profilePic: profile.avatar
                ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
                : "",
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
