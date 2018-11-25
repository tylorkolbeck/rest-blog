const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {type: String},
    author: {type: String, default: "Tylor Kolbeck"},
    createdAt: {type: Date, default: Date.now},
    userId: {type: mongoose.Schema.Types.ObjectId, default: new mongoose.Types.ObjectId()},
    bodyText: {type: String},
    description: {type: String},
    tags: {type: Array},
    category: {type: String},
    postImages: {type: Array},
    isPublic: {type: Boolean, default: false}
})

module.exports = mongoose.model('Post', postSchema)