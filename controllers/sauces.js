// Prodcut model import.
const Sauce = require("../models/Sauce");
// The Node.js file system module allows to work with the computer file system.
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  // Delete mongoDB ID.
  delete sauceObject._id;
  // New instance of the product model.
  const sauce = new Sauce({
    ...sauceObject,
    // Add the dynamic url of the image.
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  // Saving the product in the database.
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  let sauceObject = {};
  req.file
    ? // If req.file exists, we look for the corresponding product in the database.
      (Sauce.findOne({ _id: req.params.id }).then((sauce) => {
        if (!sauce) {
          res.status(404).json({ error: "Objet non trouvé !" });
        }
        if (sauce.userId !== req.auth.userId) {
          res.status(403).json({ error: "Requête non autorisée !" });
        }
        // Delete the image file of the found product.
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlinkSync(`images/${filename}`);
      }),
      // Process the new data and add the new image.
      (sauceObject = {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }))
    : // If req.file does not exist, we process the incoming object.
      (sauceObject = {
        ...req.body,
      });

  Sauce.updateOne(
    { _id: req.params.id },
    {
      ...sauceObject,
      _id: req.params.id,
    }
  )
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  // Look for the product in the database.
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        res.status(404).json({ error: "Objet non trouvé !" });
      }
      if (sauce.userId !== req.auth.userId) {
        res.status(403).json({ error: "Requête non autorisée !" });
      }
      // Delete the product
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.staus(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  // Look for the product id corresponding to the request id.
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  // Look for all  the products.
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.likeDislike = (req, res, next) => {
  const sauceId = req.params.id;
  const userId = req.body.userId;
  const like = req.body.like;
// Add a like.
  switch (like) {
    case 1:
      Sauce.updateOne(
        { _id: sauceId },
        { $push: { usersLiked: userId }, $inc: { likes: +1 } }
      )
        .then(() => res.status(200).json({ message: "L'utilisateur aime !" }))
        .catch((error) => res.status(400).json({ error }));
      break;
// Add a dislikes.
    case -1:
      Sauce.updateOne(
        { _id: sauceId },
        { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } }
      )
        .then(() =>
          res.status(200).json({ message: "L'utilisateur n'aime pas !" })
        )
        .catch((error) => res.status(400).json({ error }));
      break;

    case 0:
      Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
          if (sauce.usersLiked.includes(userId)) {
            // Remove a like.
            Sauce.updateOne(
              { _id: sauceId },
              { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
            )
              .then(() => res.status(200).json({ message: "Like annulé !" }))
              .catch((error) => res.status(400).json({ error }));
          }
          if (sauce.usersDisliked.includes(userId)) {
            // Remove a dislike.
            Sauce.updateOne(
              { _id: sauceId },
              { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } }
            )
              .then(() => res.status(200).json({ message: "Dislike annulé !" }))
              .catch((error) => res.status(400).json({ error }));
          }
        })
        .catch((error) => res.status(404).json({ error }));
      break;

    default:
      return res.status(500).json({ error });
  }
};
