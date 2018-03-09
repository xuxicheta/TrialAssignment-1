const assert = require('assert');
const myBefore = require('./helpers/beforeAll');
const myAfter = require('./helpers/afrerAll');

const uniqueSuffix = String(Math.random()) + String(Math.random());

let admin;
let user;
let guest;

before(async () => {
  [admin, user, guest] = await myBefore(uniqueSuffix);
});

after(async () => {
  await myAfter(uniqueSuffix);
});

describe('User operations', async () => {
  it('whoami test', async () => {
    const { body: resAdmin } = await admin.request.get('/api/whoami');
    const { body: resUser } = await user.request.get('/api/whoami');
    const { body: resGuest } = await guest.request.get('/api/whoami');

    // successes
    assert.ok(resAdmin.success);
    assert.ok(resUser.success);
    assert.ifError(resGuest.success);
    // result correctness
    assert.equal(resAdmin.user.username, admin.username);
    assert.equal(resUser.user.username, user.username);
  });

  it('create user', async () => {
    const randomUser = function randomUser() {
      return {
        username: `TestRandomUser${Math.random()}${uniqueSuffix}`,
        password: 'randompassword',
      };
    };

    const { body: resAdmin } = await admin.request.post('/api/user').send(randomUser());
    const { body: resUser } = await user.request.post('/api/user').send(randomUser());
    const { body: resGuest } = await guest.request.post('/api/user').send(randomUser());

    // successes
    assert.ok(resAdmin.success);
    assert.ok(resUser.success);
    assert.ok(resGuest.success);
    // result correctness
    assert.ok(resAdmin.user.id);
    assert.ok(resUser.user.id);
    assert.ok(resGuest.user.id);
  });

  it('read user', async () => {
    const { body: resAdmin } = await admin.request.get(`/api/user/${user.id}`);
    const { body: resUser } = await user.request.get(`/api/user/${user.id}`);
    const { body: resGuest } = await guest.request.get(`/api/user/${user.id}`);

    // successes
    assert.ok(resAdmin.success);
    assert.ok(resUser.success);
    assert.ifError(resGuest.success);
    // result correctness
    assert.ok(resAdmin.user.id);
    assert.ok(resUser.user.id);
  });

  it('update user', async () => {
    const { body: resAdmin } = await admin.request.put('/api/user').send({ id: admin.id, username: `updated${admin.username}` });
    const { body: resUser } = await user.request.put('/api/user').send({ id: user.id, username: `updated${user.username}` });
    const { body: resGuest } = await guest.request.put('/api/user').send({ id: user.id, username: `updated${user.username}` });

    // successes
    assert.ifError(resAdmin.success);
    assert.ok(resUser.success);
    assert.ifError(resGuest.success);
    // result correctness
    assert.ok(resUser.user.username, `updated${user.username}`);
  });

  it('delete user', async () => {
    const { body: user1 } = await guest.request.post('/api/user').send({ username: `testuser1${uniqueSuffix}`, password: '12345678' });
    const { body: user2 } = await guest.request.post('/api/user').send({ username: `testuser2${uniqueSuffix}`, password: '12345678' });
    const { body: user3 } = await guest.request.post('/api/user').send({ username: `testuser3${uniqueSuffix}`, password: '12345678' });

    const { body: resAdmin } = await admin.request.delete(`/api/user/${user1.user.id}`);
    const { body: resUser } = await user.request.delete(`/api/user/${user2.user.id}`);
    const { body: resGuest } = await guest.request.delete(`/api/user/${user3.user.id}`);

    // successes
    assert.ok(resAdmin.success);
    assert.ifError(resUser.success);
    assert.ifError(resGuest.success);
  });
});
