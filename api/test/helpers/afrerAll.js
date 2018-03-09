/**
 * run after all tests
 */
const db = require('../../models');
/**
 * remove records from User and Post collections ending with uniqueSuffix
 * @param {String} uniqueSuffix
 */
module.exports = async uniqueSuffix => Promise.all([
  db.User.remove({
    username: new RegExp(`${uniqueSuffix}$`),
  }),
  db.Post.remove({
    title: new RegExp(`${uniqueSuffix}$`),
  }),
]);
