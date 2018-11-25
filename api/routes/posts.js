// ROUTER LEVEL
const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth')
const multer = require('multer')

const PostsController = require('../controllers/posts')


// ## THIS CONTROLS THE IMAGE UPLOAD ## //
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/postImages')
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(new Error('File type not accepted.'), false)
    }
}

const upload = multer({
    storage: storage, 
    limits: {
        filesize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter
})
// ###### END MULTER SETUP ###### //

// POST
// posts/
router.get("/", PostsController.posts_get_all);

// POST
// posts/:postId
// NEED TO ADD AUTHORIZATION
router.post("/", upload.single('postImages'), PostsController.posts_create_post);

// router.get("/", checkAuth, OrdersController.posts_create_post);

module.exports = router;
