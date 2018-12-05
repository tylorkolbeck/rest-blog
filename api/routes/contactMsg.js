// ROUTER LEVEL
const express = require("express");
const router = express.Router();
const contactMsgController = require('../controllers/contactMsg') // ##########

// GET
// contactMsgs/
// GETS all messages
router.get("/", contactMsgController.contactMsg_get_all);

// GET
// contactMsg/:msg
// Gets a single msg 
// router.get("/:msgId", checkAuth, PostsController.posts_filter_tag);

// POST
// contactMsg/
// Adds a new message to messages
router.post("/", contactMsgController.contactMsg_create_message);

// DELETE
// msg/:msgId
// Deletes a message from the db
// router.delete("/:msgId", checkAuth, PostsController.posts_delete_post);


module.exports = router;
