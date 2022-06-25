require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const tokenKey = process.env.TOKEN_PASSWORD;
    const token = req.headers.authorization.split(" ")[1];
    const verifiedToken = jwt.verify(token, tokenKey);
    const userId = verifiedToken.userId;
    req.auth = { userId };
    if (req.body.userId && req.body.userId !== userId) {
      throw "User ID non valable !";
    } else {
      next();
    }
  } catch (error) {
    res.status(403).json({ error: error | "Unauthorized request." });
  }
};
