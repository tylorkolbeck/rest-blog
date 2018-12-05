const mongoose = require('mongoose')

const contactMsgSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {type: String},
    dateSent: {type: Date, default: Date.now},
    name: {type: String, required: true},
    email: {type: String},
    subject: {type: String},
    body: {type: String, required: true},
    wasRead: {type: Boolean, default: false}
})

module.exports = mongoose.model('contactMsg', contactMsgSchema)