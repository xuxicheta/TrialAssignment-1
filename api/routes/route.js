const express = require('express');
const ctrlUser = require('../controllers/user');
const ctrlPost = require('../controllers/post');
const ctrlAuth = require('../controllers/auth');
const access = require('../controllers/access');

const router = express.Router();

// login
router.post('/login', ctrlAuth.login);
// authenticate
router.all('*', ctrlAuth.authenticate);
// whoami
router.get('/whoami', ctrlAuth.whoami);

// user
router.get('/user/:userId', access.AdminAndUsers, ctrlUser.read);
router.delete('/user/:userId', access.AdminOnly, ctrlUser.delete); // only admin can delete users
router.post('/user', ctrlUser.create); // register for everybody
router.put('/user', access.UsersOnly, ctrlUser.update); // user must be owner

// posts
router.get('/posts/', access.AdminAndUsers, ctrlPost.postList);
router.get('/posts/paged/:offset', access.AdminAndUsers, ctrlPost.postListPaged);

// post
router.get('/post/:postId', access.AdminOnly, ctrlPost.read);
router.delete('/post/:postId', access.AdminOnly, ctrlPost.delete);
router.post('/post', access.AdminOnly, ctrlPost.create);
router.put('/post', access.AdminOnly, ctrlPost.update);


module.exports = router;
