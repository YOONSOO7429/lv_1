const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    commentId: {
        type: String,
        required: true,
        unique: true
    },
    postId: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    content: {
        type: String,
    },
    createdAt: {
        type: Date,
    },
    password: {
        type: String,
        required: true,
    },

})

module.exports = mongoose.model("Comment", commentSchema);