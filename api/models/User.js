// User model
const mongoose = require('mongoose');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
});
/**
 * compares input password with one in database
 * @param {String} passCandidate
 * @returns {Boolean} result of compare
 */
UserSchema.methods.comparePass = function comparePass(passCandidate) {
  if (!passCandidate || !this.hash) return false;
  return this.hash === crypto.pbkdf2Sync(passCandidate, this.salt, 1, 64, 'sha512').toString('hex');
};
/**
 * make hash and salt fields in database from input password
 * @param {String} password
 */
UserSchema.methods.encryptPassword = function encryptPassword(password) {
  this.salt = crypto.randomBytes(128).toString('base64');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1, 64, 'sha512').toString('hex');
};

if (!UserSchema.options.toObject) UserSchema.options.toObject = {};

UserSchema.options.toObject.versionKey = false;
/**
 * mongoose transform
 * slightly modify object from MondoDB, remove _id, __v, hash, salt fields, add id field
 */
UserSchema.options.toObject.transform = function transform(doc, ret) {
  ret.id = ret._id; // eslint-disable-line
  delete ret._id; // eslint-disable-line
  delete ret.hash;
  delete ret.salt;
  return ret;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
