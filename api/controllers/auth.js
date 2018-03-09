const jwt = require('jsonwebtoken'); // in passport-jwt dependencies
const db = require('../models');
const passport = require('../lib/passport');
const secret = require('../config/jwt.json').secret;
const debug = require('debug')('catch');

module.exports = {
  async login(req, res) {
    try {
      if (!req.body.username) throw new Error('no username');
      if (!req.body.password) throw new Error('no password');

      const user = await db.User.findOne({
        username: req.body.username,
      });
      if (!user) throw new Error('no user found');
      if (!user.comparePass(req.body.password)) throw new Error(`${req.body.username} password isn't match`);

      user.lastLogin = Date.now();
      user.save(); // no await, coz it's not neccessary operation

      const token = jwt.sign({ id: user.id }, secret);
      res.json({
        success: true,
        token,
        id: user.id,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
      });
      debug(err);
    }
  },

  async whoami(req, res) {
    if (req.user) {
      res.json({
        success: true,
        user: req.user,
      });
    } else {
      res.status(500).json({
        success: false,
      });
    }
  },

  authenticate(req, res, next) {
    passport.authenticate('jwt', (err, user) => {
      if (user) req.user = user; // it should does automatically by req.logIn, but it's not
      return next();
    })(req, res, next);
  },
};
