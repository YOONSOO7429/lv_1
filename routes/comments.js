const express = require("express");
const Comment = require("../schemas/comment.js");
const mongoose = require("mongoose");
const router = express.Router();

// 댓글 목록 조회
router.get("/posts/:_postId/comments", async (req, res) => {
    // commentId, user, content, createdAt 조회
    const comments = await Comment.find({}, { _id: 0, commentId: 1, user: 1, content: 1, createdAt: 1 })
    // 날짜 내림차순으로 정렬
    const result = comments.sort((a, b) => a.createdAt - b.createdAt).reverse();

    res.json({ data: result });
})

// 댓글 작성
router.post("/posts/:_postId/comments", async (req, res) => {
    // _postId를 params로 받아오기
    const { _postId } = req.params;
    // 작성한 댓글 body로 받기
    const { user, password, content } = req.body;
    // commentId 부여하기
    const commentId = new mongoose.Types.ObjectId();

    // 입력이 없으면 메세지 띄워주기
    if (!(user && password)) {
        return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
    } else if (!content) {
        return res.status(400).json({ message: "댓글 내용을 입력해주세요." })
    }

    // 댓글 생성하기
    await Comment.create({ user, password, content, commentId, postsId: _postId, createdAt: new Date() })

    res.json({ message: "게시글을 생성하였습니다." })
})

// 댓글 수정
router.put("/posts/:_postId/comments/:_commentId", async (req, res) => {
    // _commentId 받아오기
    const { _commentId } = req.params
    // 수정 내용 body로 받기
    const { password, content } = req.body;
    // amho로 기존에 password 받아오기
    const amho = Comment.find({ commentId: _commentId }, { _id: 0, password: 1 })
    // commentId에 일치하는 comment 가져오기
    const comment = await Comment.find({ commentId: _commentId });

    // 댓글 내용이 없을 경우, 일치하는 댓글이 없을 경우
    if (!comment) {
        return res.status(404).json({ message: "댓글 조회에 실패하였습니다." })
    } else if (!content) {
        return res.status(400).json({ message: "댓글 내용을 입력해주세요." })
    }

    // 암호가 password와 일치 여부
    if (amho === password) {
        await Comment.updateOne({ $set: { content } })
        return res.json({ message: "댓글을 수정하였습니다." })
    } else {
        return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
    }

})

// 댓글 삭제
router.delete("/posts/:_postId/comments/:_commetId", async (req, res) => {
    // commentId를 params로 받기
    const { _commentId } = req.params
    // 입력 값 body로 받기
    const { password } = req.body;
    // amho로 기존에 password 받아오기
    const amho = Comment.find({ commentId: _commentId }, { _id: 0, password: 1 })
    // commentId에 일치하는 comment 가져오기
    const comment = await Comment.find({ commentId: _commentId });

    // commentId로 댓글 조회
    if (!comment) {
        return res.status(404).json({ message: "댓글 조회에 실패하였습니다." })
    }

    // password를 입력 안했을 경우
    if (!password) {
        return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
    }

    // 암호가 password와 일치 여부
    if(amho === password) {
        return res.json({ message: "댓글을 삭제하였습니다." });
    } else {
        return res.status(400).json({ message: "비밀번호가 틀렸습니다."})
    }

})



module.exports = router;