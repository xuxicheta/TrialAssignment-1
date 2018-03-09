/**
 * main database module
 */
const mongoose = require('mongoose');
const mongo = require('../config/mongo.json');

const conn = {
  username: process.env.MONGO_USERNAME || mongo.username || '',
  password: process.env.MONGO_PASSWORD || mongo.password || '',
  host: process.env.MONGO_HOST || mongo.host || 'localhost',
  database: process.env.MONGO_DATABASE || mongo.database,
  port: process.env.MONGO_PORT || mongo.port || 27017,
};

const connectionString = [
  'mongodb://',
  (conn.username ? `${conn.username}:${conn.password}@` : ''),
  conn.host,
  ':',
  conn.port,
  '/',
  conn.database,
].join('');
console.log(connectionString);

mongoose.Promise = Promise;
mongoose.connect(connectionString);

if (process.env.MONGODEBUG) mongoose.set('debug', true);

const db = mongoose.connection;
db.User = require('./User');
db.Post = require('./Post');

db.on('error', () => {
  console.error('connection error:');  // eslint-disable-line
});
db.once('open', () => {
  console.log('mongo connected');  // eslint-disable-line
});

module.exports = db;
