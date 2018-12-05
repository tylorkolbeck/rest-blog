const Message = require("../models/contactMsg")
const mongoose = require("mongoose");

// ######################################################### //
// ###### GET REQUEST TO RETRIEVE ALL MESSAGES IN THE DB ###### //
exports.contactMsg_get_all = (req, res, next) => {
    Message.find()
        .select()
        .exec()
        .then(docs => {
            res.status(200).json({
                message: 'Found some messages!',
                numMessages: docs.length,
                contactMsg: docs.map(doc => {
                    return {
                        _id: doc.id,
                        dateSent: doc.dateSent,
                        name: doc.name,
                        email: doc.email,
                        subject: doc.subject,
                        body: doc.body,
                        userId: doc.userId,
                        wasRead: doc.wasRead
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

// ###################################################### //
// ###### POST REQUEST TO ENTER A MESSAGE INTO THE DB ###### //
exports.contactMsg_create_message = (req, res, next) => {
    const newMsgId = new mongoose.Types.ObjectId()
    const message = new Message ({
        _id: newMsgId,
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        body: req.body.body, 
    })
    message.save() // Save the post to the DB then show the results
        .then(result => {
            res.status(201).json({
                message: 'Form Submitted!',
                contactMsg: {
                    id: result._id,
                    name: result.name,
                    email: result.email,
                    subject: result.subject,
                    body: result.body
                }
            })
        console.log(message)
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

// ##################################################################### //
// ###### GET REQUEST TO RETRIEVE A SINGLE MESSAGE BY ID FROM THE DB ###### //
exports.contactMsg_get_msg = (req, res, next) => {
    const msgId = req.params.msgId
    Message.findById(msgId)
    .select()
    .exec()
    .then((doc) => {
        if (doc._id) {
            console.log(doc.length)
            res.status(200).json({
                message: "Message found.",
                doc
            })
        } else {
            console.log(doc.length)
            res.status(404).json({
                message: "Message not found",
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



// // This error checking function checks to see what
// // fields were missing on a post request and returns them
// fieldCheck = (err) => {
//     const keys = Object.keys(err.errors)
//     const numErrors = keys.length
//     const errorTypes = []
//     const missingFields = []

//     keys.forEach((key) => {
//         if (err.errors[key].message) {
//             errorTypes.push(err.errors[key].message)
//         }
//         if (err.errors[key].path) {
//             missingFields.push(err.errors[key].path)
//         }
//     })
//     // Return an object holding the details of the error
//     return {
//         numErrors: numErrors,
//         errorTypes: errorTypes,
//         missingFields: missingFields
//     }
// }


// // ###################################################### //
// // ###### DELETE REQUEST TO DELETE A POST FROM THE DB ###### //
// exports.posts_delete_post = (req, res, next) => {
//     const postId = req.params.postId
//     Post.deleteOne({_id: postId})
//         .exec()
//         .then(result => {
//             console.log(result.n === 1)
//             if (result.n) {
//                 res.status(200).json({
//                     message: `${postId} was deleted from the DB`,
//                 })
//             } else {
//                 res.status(500).json({
//                     message: "That post was not found"
//                 })
//             }
            
//         })
//         .catch(err => {
//             console.log(err)
//             res.status(500).json({
//                 error: err
//             })
//         })
// }

// // ###################################################### //
// // ###### PATCH REQUEST TO UPDATE A POST FROM THE DB ###### //
// exports.posts_update_post = (req, res, next) => {
//     const postId = req.params.postId
//     const updates = {}
//     for (const ops of req.body) {
//         if (ops.propName === "tags") {
//             // console.log(ops.value.toString().split(','))
//             // let tagsString = ops.value.toString().split()
//             // updates[ops.propName] = tagsString
//             // console.log("TYPEOF", typeof tagsString)
//             console.log(ops.value)
//         }
//         updates[ops.propName] = ops.value  
//     }

//     Post.findByIdAndUpdate({_id: postId}, {$set: updates})
//         .select()
//         .exec()
//         .then(result => {
//             res.status(200).json({
//                 message: 'Post updated',
//                 request: {
//                     type: "GET",
//                     urls: process.env.ROOT_URL + '/posts/' + postId
//                 }
//             })
//         })
//         .catch(err => {
//             console.log(err)
//             res.status(500).json({
//                 error: err
//             })
//         })

// }


// // ###################################################### //
// // ###### GET REQUEST WITH THAT RETURNS POSTS WITH A CERTAIN TAG ###### //
// exports.posts_filter_tag = (req, res, next) => {
//     console.log('QUERY OBJECT')
//     console.log(req.query)


//     queryArray =[]
    

//     for (let param in req.query) {
//         queryArray.push(req.query[param])
//         console.log('--', req.query[param])
//     }

//     Post.find({tags: {$in: queryArray}})
//         .select('_id userId tags postImages title author bodyText description category createdAt isPublic')
//         .exec()
//         .then((posts) => {
//             if (posts.length > 0) {
//                 res.status(200).json({
//                     message: "Found the post",
//                     posts
//                 })
//             } else if (post.length == 0) {
//                 res.status(404).json({
//                     message: "No posts found with that tag",
//                 })
//             }
            
//         })
//         .catch((err)=> {
//             res.status(500).json({
//                 message: "Post not found",
//                 error: err
//             })
//         })
    
// }