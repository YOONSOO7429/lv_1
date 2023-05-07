const express = require('express');
const router = express.Router();

const { Users } = require('../models');

// 회원가입 API
router.post('/signup', async (req, res) => {
  // {nickname, password, confirm} body로
  const { nickname, password, confirm } = req.body;
  // 알파벳 대소문자, 숫자로 구성(.test(String)하면 일치할 경우 true, 일치하지 않으면 false)
  const regExp = /^[0-9a-zA-Z]{3,}$/;
  try {
    // 닉네임은 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)로 구성하기
    if (!regExp.test(nickname)) {
      return res
        .status(412)
        .json({ errorMessage: '닉네임의 형식이 일치하지 않습니다.' });
    }

    // 비밀번호 확인은 비밀번호와 정확하게 일치하기
    if (password !== confirm) {
      return res
        .status(412)
        .json({ errorMessage: '패스워드가 일치하지 않습니다.' });
    }

    // 최소 4자 이상이며, 닉네임과 같은 값이 포함된 경우 회원가입에 실패
    if (password.length < 4) {
      return res
        .status(412)
        .json({ errorMessage: '패스워드 형식이 일치하지 않습니다.' });
    }
    if (password.includes(nickname)) {
      return res
        .status(412)
        .json({ errorMessage: '패스워드에 닉네임이 포함되어 있습니다.' });
    }

    // 중복된 닉네임
    const existsNickname = await Users.findOne({ where: { nickname } });
    if (existsNickname) {
      return res.status(412).json({ errorMessage: '중복된 닉네임입니다.' });
    }

    // 회원가입 완료
    await Users.create({ nickname, password });
  } catch (error) {
    //400 예외 케이스에서 처리하지 못한 에러
    return res
      .status(400)
      .json({ errorMessage: '요청한 데이터 형식이 올바르지 않습니다.' });
  }

  return res.status(201).json({ message: '회원 가입에 성공했습니다.' });
});

module.exports = router;
