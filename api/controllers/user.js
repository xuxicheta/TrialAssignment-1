// user controller
const db = require('../models');
const debug = require('debug')('catch');

/* user model
username: String,
hash: String,
salt: String,
role: String,
createdAt: Date,
updatedAt:  Date,
lastLogin: Date,
*/
module.exports = {
  /**
   * @param {String} req.body.username
   * @param {String} req.body.password
   * @param {String} req.body.role
   */
  async create(req, res) {
    try {
      if (!req.body.username || !req.body.password) throw new Error('no user credentials');
      const user = new db.User({
        username: req.body.username,
        password: req.body.password,
      });
      user.encryptPassword(req.body.password);
      await user.save();
      res.json({
        success: true,
        user,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
      });
      debug(err);
    }
  },
  /**
   * @param {String} req.params.userId
   */
  async read(req, res) {
    try {
      if (!req.params.userId) throw new Error('no user id');
      const user = await db.User.findById(req.params.userId);
      if (!user) throw new Error('user not found');
      res.json({
        success: true,
        user,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
      });
      debug(err);
    }
  },
  /**
   * @param {String} req.body.id
   * @param {String} req.body.username
   * @param {String} req.body.password
   * @param {String} req.body.role
   */
  async update(req, res) {
    try {
      if (!req.body.id) throw new Error('no user id');
      const user = await db.User.findById(req.body.id);
      if (req.user.id !== user.id) throw new Error('only owner may edit himself');
      // rewrite properties
      if (req.body.username) user.username = req.body.username;
      if (req.body.role) user.role = req.body.role;
      if (req.body.password) user.encryptPassword(req.body.password);
      user.updatedAt = Date.now();
      await user.save();
      res.json({
        success: true,
        user,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
      });
      debug(err);
    }
  },
  /**
   * @param {String} req.params.userId
   */
  async delete(req, res) {
    try {
      if (req.user.id === req.params.userId) throw new Error('admin cant delete himself');
      await db.User.findByIdAndRemove(req.params.userId);
      res.json({
        success: true,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
      });
      debug(err);
    }
  },
};
