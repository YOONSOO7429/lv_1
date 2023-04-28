const express = require("express");
// const Post = require("./posts.js")
const Comment = require("../schemas/comment.js");
const router = express.Router();

const comments = [
    {
        commentId: "62d6d3fd30b5ca5442641b94",
        user: "Developer",
        content: "수정된 댓글입니다.",
        createdAt: "2022-07-19T15:55:41.490Z"
    },
    {
        commentId: "62d6d34b256e908fc79feaf8",
        user: "Developer",
        content: "안녕하세요 댓글입니다.",
        createdAt: "2022-07-19T15:52:43.212Z"
    }
]

// 댓글 목록 조회
router.get("/posts/:_postId/comments", (req, res) => {
    const result = comments.sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    }).reverse();

    res.json({ result });
})

// 댓글 작성
router.post("/posts/:_postId/comments", async (req, res) => {
    const { user, password, content } = req.body;

    if (user == "" || password == "" || content == "") {
        return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
    }
    await Comment.create({ user, password, content })

    res.json({ message: "게시글을 생성하였습니다." })
})

// 댓글 수정
router.put("/posts/:_postId/comments/:_commentsId", async (req, res) => {
    const { password, content } = req.body;

    if (content == "") {
        res.status(400).json({ message: "댓글 내용을 입력해주세요." })
        return
    }
    if (password == "" || content == "") {
        res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
        return
    }

    const existsPost = await Comment.find();
    if (existsPost.includes("postId")) {
        await Comment.updateOne({ $set: { content } })
    } else {
        return res.status(404).json({ message: "게시글 조회에 실패하였습니다." })
    }
    res.json({ message: "게시글을 수정하였습니다." })
})

// 댓글 삭제
router.delete("/posts/:_postId/comments/:_commetId", async (req, res) => {
    const { password } = req.body;

    const existsComment = await Comment.find({ password })
    if (existsComment.length) {
        await Comment.deleteOne({ password });
    } else {
        return res.status(404).json({ message: "게시글 조회에 실패하였습니다." })
    }

    res.json({ message: "게시글을 삭제하였습니다." })
})



module.exports = router;