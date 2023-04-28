const express = require("express");
const Post = require("../schemas/post.js");
const mongoose = require("mongoose");
const router = express.Router();


// 전체 게시글 목록 조회 API
router.get("/posts", async (req, res) => {
    // 제목, 작성자명, 작성 날짜 조회
    const posts = await Post.find({}, { _id: 0, postId: 1, user: 1, title: 1, createdAt: 1 })
    // 날짜 내림차순으로 정렬
    const result = posts.sort((a, b) => a.createdAt - b.createdAt).reverse();

    res.json({ data: result });
})

// 게시글 작성 API
router.post("/posts", async (req, res) => {
    // ObjectId로 postId로 Id부여하기
    const postId = new mongoose.Types.ObjectId();
    // body로 작성내용 받기
    const { user, password, title, content } = req.body;
    // 데이터가 하나라도 없는 경우
    if (!(user && password && title && content)) {
        return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
    }
    await Post.create({ postId, user, password, title, content, createdAt: new Date() })

    res.json({ message: "게시글을 생성하였습니다." })
});

// 게시글 조회 API
router.get("/posts/:_postId", async (req, res) => {
    // 제목, 작성자명, 작성 날짜, 작성 내용을 조회하기
    // params로 받아오기
    const { _postId } = req.params;
    const post = await Post.findOne({ postId: _postId }, { _id: 0, postsId: 1, user: 1, title: 1, content: 1, createdAt: 1 });
    // post 존재 여부
    if (post.length) {
        res.json({ post: post })
    } else {
        return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
    }
});

// 게시글 수정 API
router.put("/posts/:_postId", async (req, res) => {
    // params로 받아오기
    const { _postId } = req.params;
    // amho로 기존에 password 받아오기
    const amho = Post.find({ postId: _postId }, {_id:0, password:1})
    // 입력 받은 값들 body로
    const { password, title, content } = req.body;

    // 입력받은 값이 하나라도 없을 경우
    if (!(password && title && content)) {
        res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
        return
    }

    // 암호에 따라 수정 여부
    if (amho === password) {
        await Post.updateOne({ $set: { content } })     // 일치할 경우 content 수정
        return res.json({ message: "게시글을 수정하였습니다." })
    } else {
        return res.status(404).json({ message: "게시글 조회에 실패하였습니다." })
    }

})

// 게시글 삭제 API
router.delete("/posts/:_postId", async (req, res) => {
    // params로 받아오기
    const { _postId } = req.params;
    // amho로 기존에 password 받아오기
    const amho = Post.findOne({ postId: _postId }, {_id: 0, password: 1})
    // 입력 받은 값들 body로
    const { password } = req.body;

    // 입력이 없을 경우
    if (!password) {
        res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
    }

    // 암호에 따라 게시글 삭제 여부
    if (amho === password) {
        await Post.deleteOne({ _postId });  // 암호가 맞다면 _postId에 해당하는 글 삭제
        return res.json({ message: "게시글을 삭제하였습니다." })
    } else {
        return res.status(404).json({ message: "게시글 조회에 실패하였습니다." })
    }

})

module.exports = router;