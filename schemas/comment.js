const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    commentId: {
        type: String,
        unique: true
    },
    user: {
        type: String,
    },
    content: {
        type: String,
    },
    createdAt: {
        type: Date,
    },
    password: {
        type: String,
    },

})

module.exports = mongoose.model("Comment", commentSchema);