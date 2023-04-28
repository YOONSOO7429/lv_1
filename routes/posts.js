const express = require("express");
const Post = require("../schemas/post.js");
const router = express.Router();

const posts = [
    {
        postId: "62d6d12cd88cadd496a9e54e",
        user: "Developer",
        title: "안녕하세요",
        createdAt: "2022-07-19T15:43:40.266Z"
    },
    {
        postId: "62d6cc66e28b7aff02e82954",
        user: "Developer",
        title: "안녕하세요",
        createdAt: "2022-07-19T15:23:18.433Z"
    }
]

const post = {
    postId: "62d6cb83bb5a517ef2eb83cb",
    user: "Developer",
    title: "안녕하세요",
    content: "안녕하세요 content 입니다.",
    createdAt: "2022-07-19T15:19:31.730Z"
}

// 전체 게시글 목록 조회 API
router.get("/posts", (req, res) => {

    // 날짜 내림차순으로 정렬
    const result = posts.sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    }).reverse();

    res.json({ result });
})

// 게시글 작성 API
router.post("/posts", async (req, res) => {
    const { user, password, title, content } = req.body;

    if (user == "" || password == "" || title == "" || content == "") {
        return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
    }
    await Post.create({ user, password, title, content })

    res.json({ message: "게시글을 생성하였습니다." })
})

// 게시글 조회 API
router.get("/posts/:_postId", async (req, res) => {
    if(post == {}) {
        return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다."})
    }

    res.json({post: post})
})

// 게시글 수정 API
router.put("/posts/:_postId", async (req, res) => {
    const { password, title, content } = req.body;

    if (password == "" || title == "" || content == "") {
        res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
        return
    }

    const existsPost = await Post.find({ password: password});
    if (existsPost.length) {
        await Post.updateOne({ $set: { content } })
    } else {
        return res.status(404).json({ message: "게시글 조회에 실패하였습니다." })
    }
    res.json({ message: "게시글을 수정하였습니다." })
})

// 게시글 삭제 API
router.delete("/posts/:_postId", async (req, res) => {
    const { password } = req.body;

    if (password =="") {
        res.status(400).json({message: "데이터 형식이 올바르지 않습니다."})
    }

    const existsPost = await Post.find({ password: password })
    if (existsPost.length) {
        await Post.deleteOne({ existsPost: existsPost });
    } else {
        return res.status(404).json({ message: "게시글 조회에 실패하였습니다." })
    }

    res.json({ message: "게시글을 삭제하였습니다." })
})

module.exports = router;