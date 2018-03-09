const supertest = require('supertest');
const defaults = require('superagent-defaults');
const db = require('../../models');
const adminJson = require('../../config/admin.json');
const userJson = require('../data/user.json');
const app = require('../../app');

module.exports = async (uniqueSuffix) => {
  const request = defaults(supertest(app));

  userJson.username += uniqueSuffix;

  const admin = await db.User.findOne({ username: adminJson.username });
  const user = new db.User(userJson);
  user.encryptPassword(userJson.password);
  await user.save();
  const guest = {};

  // get tokens
  const adminResponse = await request.post('/api/login').send(adminJson);
  const userResponse = await request.post('/api/login').send(userJson);

  if (!adminResponse.body.token && !adminResponse.body.token) throw new Error('fail with token');

  admin.request = defaults(supertest(app)).set({ Authorization: `JWT ${adminResponse.body.token}` });
  user.request = defaults(supertest(app)).set({ Authorization: `JWT ${userResponse.body.token}` });
  guest.request = defaults(supertest(app)).set({ Authorization: 'JWT wrong_token_sample' });

  return [admin, user, guest];
};

if (module.parent === null) {
  module.exports(Math.random()).then(console.log); // eslint-disable-line
}
