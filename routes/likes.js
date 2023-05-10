const express = require('express');
const { Likes, Users, Posts, sequelize } = require('../models');
const { Op } = require('sequelize');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');

function parseLikePostsModel(likes) {
  return likes.map((like) => {
    let obj = {};

    for (const [k, v] of Object.entries(like)) {
      if (k.split('.').length > 1) {
        const key = k.split('.')[1];
        obj[key] = v;
      } else obj[k] = v;
    }
    return obj;
  });
}
// 11. 좋아요 게시글 조회 API
//      @로그인 토큰을 검사하여, 유효한 토큰일 경우에만 좋아요 게시글 조회 가능
//      @로그인 토큰에 해당하는 사용자가 좋아요 한 글에 한해서, 조회할 수 있게 하기
//      @제목, 작성자명(nickname), 작성 날짜, 좋아요 갯수를 조회하기
//      @제일 좋아요가 많은 게시글을 맨 위에 정렬하기 (내림차순)

router.get('/posts/like', authMiddleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const posts = await Posts.findAll({
      attributes: [
        'postId',
        'userId',
        [sequelize.fn('NICKNAME', sequelize.col('Users.')), 'nickname'],
        'title',
        'createdAt',
        'updatedAt',
        [sequelize.fn('COUNT', sequelize.col('Likes.postId')), 'likes'],
      ],
      include: [
        {
          model: Users,
          attributes: [],
        },
        {
          model: Likes,
          attributes: [],
          require: true,
          where: {
            [Op.and]: [{ userId: userId }],
          },
        },
      ],
      group: ['Posts.postId'],
      order: [['likes', 'DESC']],
      raw: true,
    });
    return res.status(200).json({ posts });
  } catch (error){
    // 예외케이스에서 처리하지 못한 에러
    console.error(error)
    return res
      .status(400)
      .json({ errorMessage: '좋아요 게시글 조회에 실패하였습니다.' });
  }
});

// 10. 게시글 좋아요 API
//      @로그인 토큰을 검사하여, 유효한 토큰일 경우에만 게시글 좋아요 가능
//      @로그인 토큰에 해당하는 사용자가 좋아요 한 글에 한해서, 좋아요 취소 할 수 있게 하기
//      @게시글 목록 조회시 글의 좋아요 갯수도 같이 표출하기

router.put('/posts/:postId/like', authMiddleware, async (req, res) => {
  try {
    // 정보 받아오기
    const { postId } = req.params;
    const { userId } = res.locals.user;

    // 게시글 조회
    const post = await Posts.findOne({ where: { postId } });

    if (!post) {
      return res
        .status(404)
        .json({ errorMessage: '게시글이 존재하지 않습니다.' });
    }

    // 좋아요 조회
    let like = await Likes.findOne({
      where: { postId: postId, userId: userId },
    });

    if (!like) {
      await Likes.create({ postId: postId, userId: userId });

      return res
        .status(200)
        .json({ message: '게시글의 좋아요를 등록하였습니다.' });
    } else {
      await Likes.destroy({ postId: postId, userId: userId });
      return res
        .status(200)
        .json({ message: '게시글의 좋아요를 취소하였습니다.' });
    }
  } catch {
    // 예외 케이스에서 처리하지 못한 에러
    return res
      .status(400)
      .json({ errorMessage: '게시글 좋아요에 실패하였습니다.' });
  }
});

module.exports = router;
