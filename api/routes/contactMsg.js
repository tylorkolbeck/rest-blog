// ROUTER LEVEL
const express = require("express");
const router = express.Router();
const contactMsgController = require('../controllers/contactMsg') 
const checkAuth = require('../middleware/check-auth')

// GET
// contactMsgs/
// Get all messages
router.get("/", checkAuth, contactMsgController.contactMsg_get_all); // TODO: Add authorization.

// GET
// contactMsg/:msg
// Gets a single msg 
router.get("/:msgId",  contactMsgController.contactMsg_get_msg); // TODO: Add authorization.

// POST
// contactMsg/
// Adds a new message to contactmsgs
router.post("/", contactMsgController.contactMsg_create_message);

// DELETE
// msg/:msgId
// Deletes a message
router.delete("/:msgId", checkAuth, contactMsgController.contactMsg_delete_msg);// TODO: Add authorization.

// PATCH
// msg/:id
// Updates a message
router.patch("/:msgId", checkAuth, contactMsgController.contactMsg_patch_msg)

module.exports = router;
