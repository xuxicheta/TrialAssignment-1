const assert = require('assert');
const settings = require('../config/settings.json');
const myBefore = require('./helpers/beforeAll');
const myAfter = require('./helpers/afrerAll');
const postData = require('./data/post.json');

const uniqueSuffix = String(Math.random()) + String(Math.random());
postData.title += uniqueSuffix;

let admin;
let user;
let guest;


before(async () => {
  [admin, user, guest] = await myBefore(uniqueSuffix);
});

after(async () => {
  await myAfter(uniqueSuffix);
});

describe('Post operations', async () => {
  it('create post', async () => {
    const { body: resAdmin } = await admin.request.post('/api/post').send(postData);
    const { body: resUser } = await user.request.post('/api/post').send(postData);
    const { body: resGuest } = await guest.request.post('/api/post').send(postData);

    // successes
    assert.ok(resAdmin.success);
    assert.ifError(resUser.success);
    assert.ifError(resGuest.success);

    // result correctness
    assert.equal(resAdmin.post.title, postData.title);
    // set post id for next tests
    postData.id = resAdmin.post.id;
  });

  it('read post', async () => {
    const { body: resAdmin } = await admin.request.get(`/api/post/${postData.id}`);
    const { body: resUser } = await user.request.get(`/api/post/${postData.id}`);
    const { body: resGuest } = await guest.request.get(`/api/post/${postData.id}`);

    // successes
    assert.ok(resAdmin.success);
    assert.ifError(resUser.success);
    assert.ifError(resGuest.success);

    // result correctness
    assert.equal(resAdmin.post.title, postData.title);
    assert.equal(resAdmin.post.body, postData.body);
  });

  it('update post', async () => {
    const { body: resAdmin } = await admin.request.put('/api/post').send({ id: postData.id, body: 'coolstory admin' });
    const { body: resUser } = await user.request.put('/api/post').send({ id: postData.id, body: 'coolstory admin' });
    const { body: resGuest } = await guest.request.put('/api/post').send({ id: postData.id, body: 'coolstory admin' });

    // successes
    assert.ok(resAdmin.success);
    assert.ifError(resUser.success);
    assert.ifError(resGuest.success);

    // result correctness
    assert.equal(resAdmin.post.title, postData.title);
    assert.equal(resAdmin.post.body, 'coolstory admin');
  });

  it('delete post', async () => {
    // order changes because its lazy to create three random posts and failures going first
    const { body: resGuest } = await guest.request.delete(`/api/post/${postData.id}`);
    const { body: resUser } = await user.request.delete(`/api/post/${postData.id}`);
    const { body: resAdmin } = await admin.request.delete(`/api/post/${postData.id}`);

    // successes
    assert.ok(resAdmin.success);
    assert.ifError(resUser.success);
    assert.ifError(resGuest.success);
  });

  it('read post list', async () => {
    const count = 50;
    await Promise.all(Array(count).fill(0).map(() => admin.request.post('/api/post').send(postData)));

    const { body: resAdmin } = await admin.request.get('/api/posts');
    const { body: resUser } = await user.request.get('/api/posts');
    const { body: resGuest } = await guest.request.get('/api/posts');

    // successes
    assert.ok(resAdmin.success);
    assert.ok(resUser.success);
    assert.ifError(resGuest.success);

    // result correctness
    assert.equal(resAdmin.posts.length, count);
    assert.equal(resUser.posts.length, count);
  });

  it('read paged post list', async () => {
    const { body: resAdmin } = await admin.request.get('/api/posts/paged/10');
    const { body: resUser } = await user.request.get('/api/posts/paged/10');
    const { body: resGuest } = await guest.request.get('/api/posts/paged/10');

    // successes
    assert.ok(resAdmin.success);
    assert.ok(resUser.success);
    assert.ifError(resGuest.success);

    // result correctness
    assert.equal(resAdmin.posts.length, settings.pageSize);
    assert.equal(resUser.posts.length, settings.pageSize);
  });
});
