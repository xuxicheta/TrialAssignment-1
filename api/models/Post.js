// Post model
const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const PostSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: String,
  author: {
    type: ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

if (!PostSchema.options.toObject) PostSchema.options.toObject = {};
PostSchema.options.toObject.transform = function transform(doc, ret) {
  ret.id = ret._id; // eslint-disable-line
  delete ret._id; // eslint-disable-line
  delete ret.__v; // eslint-disable-line
  return ret;
};

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
