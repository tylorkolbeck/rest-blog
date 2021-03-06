// TODO: add authorize user middleware to post, delete, and patch 

const Post = require("../models/post")
const aws = require('aws-sdk')
const mongoose = require("mongoose")


aws.config.update({
    // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    // accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: "us-west-2",
    credentials: new aws.CognitoIdentityCredentials({
        IdentityPoolId: 'us-west-2:97665755-35ff-4f8b-bfa4-1cf13f99b2c8'
    })
})

const s3 = new aws.S3()
exports.post_remove_image = (req, res, next) => {
    const img = req.params.img

    let params = {
        Bucket: 'tylorkolbeck.com',
        Key: 'imageUploads/' + img,
      }
  
      s3.deleteObject(params, function(err, data) {
        if (err) res.json({'error': 'Error deleting the image.'})
        else res.json({'message': 'Image Deleted!'})
      })
}

exports.directory_listing = (req, res, next) => {
    console.log('RUNNING DIRECRTORT LISTING')
        const s3Params = {
            Bucket: 'tylorkolbeck.com',
            MaxKeys: 20,
            Delimiter: '/'
        }

        s3.listObjectsV2(s3Params, (err, data) => {
            if (err) {
                console.log(err)
            } 
                console.log(data)
        })
    }



// ######################################################### //
// ###### POST REQUEST TO ADD AN IMAGE TO S3 BUCKET ###### //
exports.posts_add_image = (req, res, next) => {
    if (res.err) {
        return res.end("Error uploading file.")
    }
    return res.json({'imageUrl': req.files})
}

// ######################################################### //
// ###### GET REQUEST TO RETRIEVE ALL POSTS IN THE DB ###### //
exports.posts_get_all = (req, res, next) => {
    Post.find()
        .select()
        .exec()
        .then(docs => {
            res.status(200).json({
                message: 'There are ' + docs.length, 
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
    let imageDirectory = req.params.postId ? req.params.postId : null
    console.log('RUNNING DIRECTORY LISTING')
        const s3Params = {
            Bucket: 'tylorkolbeck.com',
            MaxKeys: 20,
            Delimiter: '',
            Prefix: `imageUploads/${imageDirectory}`,
        }

        s3.listObjectsV2(s3Params, (err, data) => {
            if (err) {
                console.log(err)
            } 
                console.log(data)
        })


    const postId = req.params.postId
    Post.findById(postId)
    .select('_id userId tags postImages title author bodyText description category createdAt isPublic')
    .exec()
    .then((doc) => {
        if (doc) {
            console.log(doc.length)
            res.status(200).json({
                message: "Found the post",
                doc
            })
        } else {
            console.log(doc.length)
            res.status(404).json({
                message: "Post not found",
                doc
            }) 
        }
        
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
    console.log('this is the request body: ', req)
    const post = new Post ({
        _id: newPostId,
        title: req.body.title,
        author: req.body.author,
        createdAt: req.body.createdAt,
        userId: req.body.userId,
        bodyText: req.body.bodyText,
        description: req.body.description,
        tags: req.body.tags,
        category:req.body.category,
        isPublic:req.body.isPublic,
        postImages: req.body.postImages,
        imageFolder: req.body.imageFolder
        
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
                    isPublic:result.isPublic,
                    imageFolder: result.imageFolder
                }
            })
        })
        .catch(err => {
            const errorObj = fieldCheck(err) // Build a custom error object to return
            res.status(500).json({
                message: 'Error'
              

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
                    message: `${postId} was deleted from the DB`,
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

// ###################################################### //
// ###### PATCH REQUEST TO UPDATE A POST FROM THE DB ###### //
exports.posts_update_post = (req, res, next) => {
    const postId = req.params.postId
    const updates = {}
    for (const ops of req.body) {
        updates[ops.propName] = ops.value  
    }

    Post.findByIdAndUpdate({_id: postId}, {$set: updates})
        .select()
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Post updated',
                request: {
                    type: "GET",
                    urls: process.env.ROOT_URL + '/posts/' + postId
                }
            })
        })
        .catch(err => {
            console.log('hhjghjghj',err)
            res.status(500).json({
                error: err
            })
        })

}


// ###################################################### //
// ###### GET REQUEST WITH THAT RETURNS POSTS WITH A CERTAIN TAG ###### //
exports.posts_filter_tag = (req, res, next) => {
    console.log('QUERY OBJECT')
    console.log(req.query)


    queryArray =[]
    

    for (let param in req.query) {
        queryArray.push(req.query[param])
        console.log('--', req.query[param])
    }

    Post.find({tags: {$in: queryArray}})
        .select('_id userId tags postImages title author bodyText description category createdAt isPublic')
        .exec()
        .then((posts) => {
            if (posts.length > 0) {
                res.status(200).json({
                    message: "Found the post",
                    posts
                })
            } else if (post.length == 0) {
                res.status(404).json({
                    message: "No posts found with that tag",
                })
            }
            
        })
        .catch((err)=> {
            res.status(500).json({
                message: "Post not found",
                error: err
            })
        })
    
}