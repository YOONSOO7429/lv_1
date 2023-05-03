const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    postId: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    },
    content: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model("Post", postSchema)