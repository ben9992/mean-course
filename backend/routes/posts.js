const express = require('express')
const Post = require('../models/post');
const router = express.Router()


router.post("", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post added successfully",
      postId: createdPost._id
    });
  })
})

router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content
  });

  Post.updateOne({ _id: req.params.id }, post).then(result => {
    res.status(201).json({
      message: "Post updated successfully"
    });
  })
})

router.get("", (req, res, next) => {
  Post.find().then(docs => {
    res.status(200).json(docs);
  })
})

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post)
      res.status(200).json(post);
    else
      res.status(404).json({
        message: "Post did not found"
      });
  })
})

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(() => {
    res.status(200).json({
      message: "Post deleted successfully"
    });
  })
})

module.exports = router
