const jwt = require("jsonwebtoken");
require("dotenv").config();

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  //check for token
  if (!token) res.status(401).json({ msg: "No token, authorization denied" });

  try {
    //Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // add user from payload
    req.user = decoded;
    next();
  } catch (e) {
    res.stats(400).json({ msg: "Token is not valid" });
  }
}

module.exports = auth;
