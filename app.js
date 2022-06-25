require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");  
const path = require("path");

const key = process.env.DB_PASSWORD;
const userDB = process.env.DB_USER;

const saucesRoutes = require("./routes/sauces");
const usersRoutes = require("./routes/users");

mongoose
  .connect(
    `mongodb+srv://${userDB}:${key}@cluster0.cjh79uw.mongodb.net/HotTakesDB?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.log(error, "Connexion à MongoDB echouée !"));

const app = express();

app.use(cors());

app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", usersRoutes);

module.exports = app;
