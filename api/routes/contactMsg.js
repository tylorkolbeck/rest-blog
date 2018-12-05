// ROUTER LEVEL
const express = require("express");
const router = express.Router();
const contactMsgController = require('../controllers/contactMsg') // ##########

// GET
// contactMsgs/
// GETS all messages
router.get("/", contactMsgController.contactMsg_get_all); // TODO: Add authorization.

// GET
// contactMsg/:msg
// Gets a single msg 
router.get("/:msgId",  contactMsgController.contactMsg_get_msg); // TODO: Add authorization.

// POST
// contactMsg/
// Adds a new message to messages
router.post("/", contactMsgController.contactMsg_create_message);

// DELETE
// msg/:msgId
// Deletes a message from the db
router.delete("/:msgId", contactMsgController.contactMsg_delete_post);// TODO: Add authorization.


module.exports = router;
