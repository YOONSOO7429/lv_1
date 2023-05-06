const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;

const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");


// 미들웨어 express 설정
app.use(express.json());
app.use(cookieParser());
app.use("/",[postsRouter, commentsRouter, usersRouter, authRouter]);


app.listen(port, () => {
    console.log(port, "포트로 서버가 열렸습니다!")
})