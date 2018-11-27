const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    _id: {type: String},
    discussion_id: {type: String},
    slug: {type: String},
    fullSlug: {type: String},
    posted: {type: String, default: Date.now()},
    author: {type: String},
    text: {type: String}
})

module.exports = mongoose.model('Comment', commentSchema)

