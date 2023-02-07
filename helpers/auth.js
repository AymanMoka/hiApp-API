const Http = require("http-status-codes");
const Jwt = require("jsonwebtoken");

module.exports = {
  ensureAuthenticated(req, res, next) {
    // console.log(req.headers);
    if (!req.headers.authorization) {
      return res
        .status(Http.StatusCodes.FORBIDDEN)
        .json({ msg: "No token, authorization denied" });
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(Http.StatusCodes.FORBIDDEN).json({ msg: "No token !, authorization denied" });
        }
        return Jwt.verify(
          token,
          process.env.secret_for_token,
            (err, decoded) => { 
                if (err) {
                    if (err.expiredAt < new Date()) {
                        return res.status(Http.StatusCodes.FORBIDDEN).json({ msg: "Token has expired" });
                    }
                    return res
                      .status(Http.StatusCodes.FORBIDDEN)
                      .json({ msg: "Token is not valid", token: null });
                }
                req.user = decoded.user;
                console.log(req.user);
                return next();
          }
        );
  },
};
