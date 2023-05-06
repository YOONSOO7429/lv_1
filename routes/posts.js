const express = require("express");
const router = express.Router();
const { Posts } = require("../models");
const { Op } = require('sequelize');
const authMiddleware = require("../middlewares/auth-middleware.js");

// 1. 게시글 작성 API
//      @ 토큰을 검사하여, 유효한 토큰일 경우에만 게시글 작성 가능
//      @ 제목, 작성 내용을 입력하기
router.post("/posts", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user
    // body로 작성내용 받기
    const { title, content } = req.body;

    // error
    if (!(title && content)) {
        return res.status(412).json({ errorMessage: "데이터 형식이 올바르지 않습니다." })
    } else if (!title && content) {
        return res.status(412).json({ errorMessage: "게시글 제목의 형식이 일치하지 않습니다." })
    } else if (title && !content) {
        return res.status(412).json({ errorMessage: "게시글 내용의 형식이 일치하지 않습니다." })
    }

    try {
        // 게시글 작성
        await Posts.create({ userId: userId, title, content });
        return res.status(201).json({ message: "게시글 작성에 성공하였습니다." });
    }
    // 예외 케이스에서 처리하지 못한 에러
    catch {
        return res.status(400).json({ errorMessage: "게시글 작성에 실패하였습니다." })
    }
});

// 2. 전체 게시글 목록 조회 API
//      @ 제목, 작성자명(nickname), 작성 날짜를 조회하기
//      @ 작성 날짜 기준으로 내림차순 정렬하기
router.get("/posts", async (req, res) => {
    try {
        // 게시글 전체 조회
        const posts = await Posts.findAll({
            attributes: ['postId', 'userId', 'title', 'createdAt', 'updatedAt'],
            order: [['createdAt', 'DESC']]
        });
        res.json({ posts });
    }
    // 예외 케이스에서 처리하지 못한 에러
    catch {
        return res.status(400).json({ errorMessage: "게시글 조회에 실패하였습니다." })
    }
})

// 3. 게시글 조회 API
//      @제목, 작성자명(nickname), 작성 날짜, 작성 내용을 조회하기
router.get("/posts/:postId", async (req, res) => {
    // params로 받아오기
    const { postId } = req.params;
    try {
        const post = await Posts.findOne({
            attributes: ['postId', 'userId', 'title', 'content', 'createdAt', 'updatedAt'],
            where: { postId }
        });
        return res.status(200).json({ post })
    }
    // 예외 케이스에서 처리하지 못한 에러
    catch {
        return res.status(400).json({ errorMessage: "게시글 조회에 실패하였습니다." })
    }
});

// 4. 게시글 수정 API
//      @토큰을 검사하여, 해당 사용자가 작성한 게시글만 수정 가능
router.put("/posts/:postId", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user
    // params로 받아오기
    const { postId } = req.params;
    // post 조회하기
    const post = await Posts.findOne({ where: { postId } })
    // 입력 받은 값들 body로
    const { title, content } = req.body;

    // error
    if (userId !== post.UserId) {
        return res.status(403).json({ errorMessage: "게시글 수정의 권한이 존재하지 않습니다." });
    }
    if (!(title && content)) {
        return res.status(412).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
    } else if (!title && content) {
        return res.status(412).json({ errorMessage: "게시글 제목의 형식이 일치하지 않습니다." });
    } else if (title && !content) {
        return res.status(412).json({ errorMessage: "게시글 내용의 형식이 일치하지 않습니다." });
    }

    try {
        const updateCount = await Posts.update(
            { title, content },
            { where: { postId, userId: userId } });

        if (updateCount < 1) {
            return res.status(401).json({ errorMessage: "게시글이 정상적으로 수정되지 않았습니다." })
        }
        return res.status(200).json({ message: "게시글을 수정하였습니다." })
    }
    // 예외 케이스에서 처리하지 못한 에러
    catch (error) {
        return res.status(400).json({ errorMessage: "게시글 수정에 실패하였습니다." });
    };
});

// 게시글 삭제 API
router.delete("/posts/:postId", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user
    // params로 받아오기
    const { postId } = req.params;
    // post 조회하기
    const post = await Posts.findByPk(postId)

    // error
    if (!post) {
        return res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다." })
    }
    if (userId !== post.UserId) {
        return res.status(403).json({ errorMessage: "게시글의 삭제 권한이 존재하지 않습니다." })
    }

    try {
        // 게시글 삭제
        const deleteCount = await Posts.destroy({ where: { postId } })
        if(deleteCount<1) {
            return res.status(401).json({ errorMessage: "게시글이 정상적으로 삭제되지 않았습니다."})
        }
        return res.status(200).json({ message: "게시글을 삭제하였습니다." })
    }
    // 예외 케이스에서 처리하지 못한 에러
    catch (error) {
        return res.status(400).json({ errorMessage: "게시글이 정상적으로 삭제되지 않았습니다." })
    }

})

module.exports = router;