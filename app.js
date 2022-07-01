// Environment variables.
require("dotenv").config();
const express = require("express");
// Cross-Origin Resource Sharing
const cors = require("cors");
// Set HTTP headers related to security.
const helmet = require("helmet");
// Rate Limiting protects against overuse of the API.
const rateLimit = require("express-rate-limit");
// Cookie-session store session data about the client in a cookie.
const session = require("cookie-session");
// The Mongoose module provides several functions to manipulate documents in the MongoDB database collection.
const mongoose = require("mongoose");
// The path module provides utilities for working with file and directory paths.
const path = require("path");

/*
Environment variables
*/

const keyDB = process.env.DB_PASSWORD;
const userDB = process.env.DB_USER;
const nameDB = process.env.DB_NAME;

/*
Routes
*/

const saucesRoutes = require("./routes/sauces");
const usersRoutes = require("./routes/users");

/*
Database
*/

const uri = `mongodb+srv://${userDB}:${keyDB}@cluster0.cjh79uw.mongodb.net/${nameDB}?retryWrites=true&w=majority`;

// Connection to the MongoDB database.
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.log(error, "Connexion à MongoDB echouée !"));

// Creating an express app.
const app = express();

/*
Middlewares
*/

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

app.use(
  session({
    name: process.env.SESSION_NAME,
    keys: process.env.SESSION_KEY,
    cookie: {
      secure: true,
      httpOnly: true,
      domain: "http://localhost:3000",
      expires: expiryDate,
    },
  })
);

const apiRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(apiRequestLimiter);

app.use(cors());

// Transform data into usable json.
app.use(express.json());

// To serve static files such as images.
app.use("/images", express.static(path.join(__dirname, "images")));

// Routes.
app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", usersRoutes);

module.exports = app;
