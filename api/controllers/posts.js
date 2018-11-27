// TODO: add a delete request
// TODO: add a patch request
// TODO: add authorize user middleware to post, delete, and patch 

const Post = require("../models/post")
const mongoose = require("mongoose");

// ######################################################### //
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

// ##################################################################### //
// ###### GET REQUEST TO RETRIEVE A SINGLE POST BY ID FROM THE DB ###### //
exports.posts_get_post = (req, res, next) => {
    const postId = req.params.postId
    Post.findById(postId)
    .select('_id userId tags postImages title author bodyText description category createAt isPublic')
    .exec()
    .then((doc) => {
        res.status(200).json({
            message: "Found the post",
            doc
        })
    })
    .catch((err)=> {
        res.status(500).json({
            message: "Post not found",
            error: err
        })
    })
}


// ###################################################### //
// ###### POST REQUEST TO ENTER A POST INTO THE DB ###### //
exports.posts_create_post = (req, res, next) => {
    const newPostId = new mongoose.Types.ObjectId()

    const post = new Post ({
        _id: newPostId,
        title: req.body.title,
        author: req.body.author,
        createdAt: req.body.createdAt,
        userId: req.body.userId,
        bodyText: req.body.bodyText,
        description: req.body.description,
        tags: req.body.tags.split(','),
        category:req.body.category,
        postImages: req.files.map((img)=> {
            return {
                originalname: img.originalname,
                size: img.size,
                mimetype: img.mimetype,
                destination: img.destination,
                newFileName: `${newPostId}-${img.filename}`
            }
        }),
        isPublic:req.body.isPublic
    })
    post.save() // Save the post to the DB then show the results
        .then(result => {
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
            const errorObj = fieldCheck(err) // Build a custom error object to return
            console.log(err)
            res.status(500).json({
                message: 'Error',
                ...errorObj

            })
        })
}

// This error checking function checks to see what
// fields were missing on a post request and returns them
fieldCheck = (err) => {
    const keys = Object.keys(err.errors)
    const numErrors = keys.length
    const errorTypes = []
    const missingFields = []

    keys.forEach((key) => {
        if (err.errors[key].message) {
            errorTypes.push(err.errors[key].message)
        }
        if (err.errors[key].path) {
            missingFields.push(err.errors[key].path)
        }
    })
    // Return an object holding the details of the error
    return {
        numErrors: numErrors,
        errorTypes: errorTypes,
        missingFields: missingFields
    }
}


// ###################################################### //
// ###### DELETE REQUEST TO DELETE A POST FROM THE DB ###### //
exports.posts_delete_post = (req, res, next) => {
    const postId = req.params.postId
    Post.deleteOne({_id: postId})
        .exec()
        .then(result => {
            console.log(result.n === 1)
            if (result.n) {
                res.status(200).json({
                    message: `${postId} was deleted from the DB`
                })
            } else {
                res.status(500).json({
                    message: "That post was not found"
                })
            }
            
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
}
