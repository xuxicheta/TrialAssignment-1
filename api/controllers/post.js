/**
 *  Express route handlers for post
 */
const db = require('../models');
const settings = require('../config/settings.json');
const debug = require('debug')('catch');

const pageSize = parseInt(settings.pageSize, 10);

/* post model
title: String,
body: String,
author: String,
createdAt: Date,
updatedAt: Date,
*/

module.exports = {
  /**
   * @param {String} req.body.title
   * @param {String} req.body.body
   * if in NOAUTH mode req.body.author is required
   */
  async create(req, res) {
    try {
      const post = new db.Post(req.body);
      if (!process.env.NOAUTH) post.author = req.user.id;
      await post.save();
      res.json({
        success: true,
        post,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
      });
      debug(err);
    }
  },
  /**
   * @param {String} req.params.postId
   */
  async read(req, res) {
    try {
      if (!req.params.postId) throw new Error('no post id');
      const post = await db.Post.findById(req.params.postId);

      if (!post) throw new Error('post not found');
      res.json({
        success: true,
        post,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
      });
      debug(err);
    }
  },
  /**
   * @param {String} req.body.title
   * @param {String} req.body.body
   * @param {String} req.body.postId
   */
  async update(req, res) {
    try {
      if (!req.body.id) throw new Error('no postId');
      const post = await db.Post.findById(req.body.id);

      // rewrite properties
      if (req.body.title) post.title = req.body.title;
      if (req.body.body) post.body = req.body.body;
      post.updatedAt = Date.now();

      await post.save();
      res.json({
        success: true,
        post,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
      });
      debug(err);
    }
  },
  /**
   * @param {String} req.params.postId
   */
  async delete(req, res) {
    try {
      await db.Post.findByIdAndRemove(req.params.postId);
      res.json({
        success: true,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
      });
      debug(err);
    }
  },

  async postList(req, res) {
    try {
      const posts = await db.Post.find({
      }, [
        'id',
        'title',
      ]);
      res.json({
        success: true,
        posts,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
      });
      debug(err);
    }
  },
  /**
   * @param {String} req.params.offset
   */
  async postListPaged(req, res) {
    try {
      const offset = parseInt(req.params.offset, 10);
      const posts = await db.Post.find({
      }, [
        'id',
        'title',
      ])
        .skip(offset)
        .limit(pageSize);
      res.json({
        success: true,
        offset,
        pageSize,
        posts,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
      });
      debug(err);
    }
  },
};
