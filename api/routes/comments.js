const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth')

const CommentsController = require('../controllers/comments')


router.get("/", CommentsController.comments_get_all);

router.post("/", CommentsController.comments_create_comment);

// router.get("/:orderId", checkAuth, OrdersController.orders_get_order);

// router.delete("/:orderId", checkAuth, OrdersController.orders_delete_order);

module.exports = router;
