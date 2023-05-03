const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    commentId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
    password: {
        type: String,
        required: true,
    },

})

module.exports = mongoose.model("Comment", commentSchema);