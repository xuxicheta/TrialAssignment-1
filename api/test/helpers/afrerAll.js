const db = require('../../models');

module.exports = async uniqueSuffix => Promise.all([
  db.User.remove({
    username: new RegExp(`${uniqueSuffix}$`),
  }),
  db.Post.remove({
    title: new RegExp(`${uniqueSuffix}$`),
  }),
]);
