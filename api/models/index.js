const mongoose = require('mongoose');

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/blog');

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
