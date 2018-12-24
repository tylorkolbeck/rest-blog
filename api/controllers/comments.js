const Comment = require("../models/comment")
const mongoose = require("mongoose")

// *********  GET ALL COMMENTS CONTROLLER ********* //
exports.comments_get_all = (req, res, next) => {
    Comment.find()
      .exec()
      .then(docs => {
        res.status(200).json({
          count: docs.length,
          comments: docs.map(doc => {
            return {
              _id: doc._id,
              discussion_id: doc.discussion_id,
              slug: doc.slug,
              fullslug: doc.fullSlug,
              posted: doc.posted,
              author: doc.author,
              text: doc.text
            };
          })
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  }

// ################################################ //
// *********  CREATE COMMENT CONTROLLER ********** //
exports.comments_create_comment = (req, res, next) => {
  const slugObj = makeSlug()
  
  const newComment = new Comment({
    _id: slugObj.fullSlug,
    discussion_id: req.body.discussion_id,
    slug: slugObj.slug,
    fullSlug: slugObj.fullSlug + '/' + req.body.parentComment,
    author: req.body.author,
    text: req.body.text
  })

  newComment
    .save()
    .then(result => {
      res.status(200).json({
        message: "Comment Added",
        _id: result._id,
        // discussion_id: result.discussion_id,
        // posted: result.posted,
        // slug: result.slug,
        // fullSlug: result.fullSlug,
        // author: result.author,
        // text: result.text
      })
    })
    .catch(err => {
      res.status(500).json({
        message: "There was an err",
        error: err
      })
    })
}

// Create an id that has a 4 number salt on the front of a millisecond timestamp.
// This is used for making a new comment ID when a comment is entered. 
const makeSlug = () => {
  const slugObj = {}
  slugObj.slug = Math.random().toString(36).substring(2, 7)
  slugObj.fullSlug = slugObj.slug + ":" + Date.now()
  return slugObj
}


