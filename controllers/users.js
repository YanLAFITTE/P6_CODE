require("dotenv").config();
// Encryption algorithm.
const bcrypt = require("bcrypt");
// Access token returned with each HTTP request to the server.
const jwt = require("jsonwebtoken");

/*
Models
*/

const User = require("../models/User");

/*
SignUp
*/

exports.signup = (req, res, next) => {
  // Bcrypt hash method.
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      // Create new user.
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      // Register the user in the database.
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

/*
Login
*/

exports.login = (req, res, next) => {
  // Find the user in the database with the same address as the request.
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.staus(401).json({ error: "Utilisateur non trouvé !" });
      }
      // The bcrypt comparison method is applied to the user and query passwords.
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          const tokenKey = process.env.TOKEN_PASSWORD;
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          // Returns a 200 status, a JSON object with a userID and a token.
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, tokenKey, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.staus(500).json({ error }));
    })
    .catch((error) => res.staus(500).json({ error }));
};
