// ROUTER LEVEL
const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth')
// const multer = require('multer')
// const multers3 = require('multer-s3')
// const aws = require('aws-sdk')
const PostsController = require('../controllers/posts')

const upload = require('../middleware/image-upload')
const singleUpload = upload.single('image')

// // ## THIS CONTROLS THE IMAGE UPLOAD ## //

// aws.config.update({
//     secretAccessKey: process.env.SECRET_ACCESS_KEY,
//     accessKeyId: process.env.ACCESS_KEY_ID,
//     region: "us-west-2"
// })

// const s3 = new aws.S3()


// const upload = multer({
//     storage: multers3({
//         s3: s3,
//         bucket: 'tylorkolbeck.com',
//         acl: 'public-read',
//         metadata: function(req, file, cb) {
//             cb(null, {fieldName: file.fieldName})
//         },
//         key: function(req, file, cb) {
//             cb(null, Date.now().toString())
//         }
//     })
// })

// const singleUpload = upload.single('image')
// ###### END MULTER SETUP ###### //

// GET
// posts/
// GETS all posts
router.get("/", PostsController.posts_get_all);

// GET
// posts/:filterTag
// Gets all posts with a filter
router.get("/filter/", PostsController.posts_filter_tag);

// POST
// posts/
// Adds a post to posts
// router.post("/", upload.array('postImages', 10), PostsController.posts_create_post);
router.post("/", checkAuth, PostsController.posts_create_post);

// POST
// posts/image_upload
// Adds a image to S3 bucket
router.post("/image-upload", upload.array('postImages', 20), PostsController.posts_add_image) 

// POST
// posts/image-delete/:img
// removes an image from the s3 bucket
router.get("/image-delete/:img", PostsController.post_remove_image)

// GET
// posts/:postid
// gets a specific post from the db
router.get("/:postId", PostsController.posts_get_post);

// DELETE
// posts/:postId
// Deletes a post from the db
router.delete("/:postId", checkAuth, PostsController.posts_delete_post);

// PATCH
// posts/:postId
// Updates a post in the db
router.patch("/:postId", checkAuth, PostsController.posts_update_post);

router.get("/directory-list", PostsController.directory_listing)



module.exports = router;
