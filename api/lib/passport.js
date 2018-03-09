/**
 * registration JWT strategy in passport.js module
 */
const passport = require('passport');
const db = require('../models');
const secret = require('../config/jwt.json').secret;
const { ExtractJwt, Strategy } = require('passport-jwt');

// jwt section
const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
jwtOptions.secretOrKey = secret;
const myJwtStrategy = new Strategy(jwtOptions, (async (payload, next) => {
  try {
    const user = await db.User.findById(payload.id);
    if (!user) throw new Error('authorization: user not found');
    next(null, user);
  } catch (err) {
    next(null, false);
  }
}));
passport.use(myJwtStrategy);

module.exports = passport;
