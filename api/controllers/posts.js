const Post = require("../models/post")
const mongoose = require("mongoose");


// ###### GET REQUEST TO RETRIEVE ALL POSTS IN THE DB ###### //
exports.posts_get_all = (req, res, next) => {
    Post.find()
        .select()
        .exec()
        .then(docs => {
            res.status(200).json({
                message: 'Connected to MLab DB',
                numPosts: docs.length,
                posts: docs.map(doc => {
                    return {
                        _id: doc.id,
                        title: doc.title,
                        author: doc.author,
                        createdAt: doc.createdAt,
                        userId: doc.userId,
                        bodyText: doc.bodyText,
                        description: doc.description,
                        tags: doc.tags,
                        category: doc.category,
                        postImages: doc.postImages,
                        isPublic: doc.isPublic,
                    }
                })
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

// ###### POST REQUEST TO ENTER A POST INTO THE DB ###### //
exports.posts_create_post = (req, res, next) => {
    const post = new Post ({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        author: req.body.author,
        createdAt: req.body.createdAt,
        userId: req.body.userId,
        bodyText: req.body.bodyText,
        description: req.body.description,
        tags: req.body.tags,
        category:req.body.category,
        postImages: req.body.postImages,
        isPublic:req.body.isPublic
    })
    post.save() // Save the post to the DB
        .then(result => {
            console.log(result)
            res.status(201).json({
                message: 'Post Added!',
                createdPost: {
                    title: result.title,
                    author: result.author,
                    createdAt: result.createdAt,
                    userId: result.userId,
                    bodyText: result.bodyText,
                    description: result.description,
                    tags: result.tags,
                    category:result.category,
                    postImages: result.postImages,
                    isPublic:result.isPublic
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
}