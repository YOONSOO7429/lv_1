const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    postId: {
        type: String,
        unique: true
    },
    user: {
        type: String,
    },
    title: {
        type: String
    },
    createdAt: {
        type: Date
    },
    content: {
        type: String
    },
    password: {
        type: String,
        unique: true
    }
})

module.exports = mongoose.model("Post", postSchema)