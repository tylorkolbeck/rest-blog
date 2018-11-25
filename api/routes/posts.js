const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth')

const PostsController = require('../controllers/posts')

// POST
// posts/
router.get("/", PostsController.posts_get_all);

// POST
// posts/:postId
// NEED TO ADD AUTHORIZATION
router.post("/", PostsController.posts_create_post);

// router.get("/", checkAuth, OrdersController.posts_create_post);


module.exports = router;
