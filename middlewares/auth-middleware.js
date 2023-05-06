// middlewares/auth-middleware.js

const jwt = require("jsonwebtoken");
const { Users } = require("../models");

module.exports = async (req, res, next) => {
    try {
        const { Authorization } = req.cookies;
        // Cookie가 존재하지 않을 경우
        if (!Authorization) {
            return res.status(403).json({ errorMessage: "로그인이 필요한 기능입니다." })
        }

        const [tokenType, token] = Authorization.split(" ");
        if (tokenType !== "Bearer") {
            return res.status(403).json({ message: "전달된 쿠키에서 오류가 발생하였습니다." });
        }

        const decodedToken = jwt.verify(token, "customized_secret_key");
        const userId = decodedToken.userId;

        const user = await Users.findOne({ where: { userId } });
        if (!user) {
            res.clearCookie("Authorization");
            return res.status(403).json({ errorMessage: "로그인이 필요한 기능입니다." });
        }
        res.locals.user = user;

        next();
    } catch (error) {
        return res.status(403).json({ 
            errorMessage: "비정상적인 요청입니다."
        });
    }
}