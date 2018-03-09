// calls from app.js
const debug = require('debug')('catch');
const db = require('../models');
const admin = require('../config/admin.json');

/**
 * check if admin user record in the database, unless record it
 */
module.exports = async function adminCheck() {
  try {
    const rec = await db.User.findOne({
      username: admin.username,
    });
    if (!rec) {
      const adminRecord = new db.User(admin);
      adminRecord.encryptPassword(admin.password);
      await adminRecord.save();
    }
  } catch (err) {
    debug('something wrong with admin check');
  }
};
