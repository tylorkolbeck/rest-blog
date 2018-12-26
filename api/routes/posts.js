// ROUTER LEVEL
const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth')
const multer = require('multer')
const multers3 = require('multer-s3')
const aws = require('aws-sdk')

const PostsController = require('../controllers/posts')


// ## THIS CONTROLS THE IMAGE UPLOAD ## //

aws.config.update({
    secretAccessKey: "RCtfDEfNb2zgkLBb3PtbsjcwgPsfXk8+a8z3ckyt",
    accessKeyId: "AKIAJNCQ2A2K4J76JO6Q",
    region: "us-west-2"
})

const s3 = new aws.S3()

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, './uploads/postImages')
//     },
//     filename: function(req, file, cb) {
//         cb(null, file.originalname)
//         // cb(null, new Date().toISOString() + file.originalname)
//     }
// })

// const fileFilter = (req, file, cb) => {
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//         cb(null, true)
//     } else {
//         cb(new Error('File type not accepted.'), false)
//     }
// }

const upload = multer({
    storage: multers3({
        s3: s3,
        bucket: 'tylorkolbeck.com',
        acl: 'public-read',
        metadata: function(req, file, cb) {
            cb(null, {fieldName: file.fieldName})
        },
        key: function(req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
})
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
router.post("/", checkAuth, upload.single('postImages'), PostsController.posts_create_post);

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



module.exports = router;
