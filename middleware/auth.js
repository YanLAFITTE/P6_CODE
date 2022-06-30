require("dotenv").config();
// Allows to manage creation and token authentication.
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const tokenKey = process.env.TOKEN_PASSWORD;
    // Retrieve the token in the header of the authorization request.
    const token = req.headers.authorization.split(" ")[1];
    // Verify the decoded token with the secret key.
    const decodedToken = jwt.verify(token, tokenKey);
    // Check that the userId sent with the request matches the userId encoded in the token.
    const userId = decodedToken.userId;
    // Add user Id to request.
    req.auth = { userId };
    if (req.body.userId && req.body.userId !== userId) {
      throw "User ID non valable !";
    } else {
      next();
    }
  } catch (error) {
    res.status(403).json({ error: error | "Requête non autorisée !" });
  }
};
