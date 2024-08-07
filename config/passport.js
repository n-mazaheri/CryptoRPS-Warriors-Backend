const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users');
const Utils = require('./utils');

passport.use(
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      const user = await User.findByUsername(username);
      if (!user || user.passwordHash !== (await Utils.hashPassword(password, user.salt))) {
        return done(null, false, { message: 'Incorrect username or password' });
      }
      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user?._id?.toHexString());
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  if (!user) {
    return done(new Error('User not found'));
  }
  done(null, user);
});

module.exports = passport;
