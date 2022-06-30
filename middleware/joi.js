const Joi = require("joi");

const userSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(4).required(),
});
exports.user = (req, res, next) => {
  const { error, value } = userSchema.validate(req.body);
  if (error) {
    res.status(400).json({ error: "email ou mot de passe invalide !" });
  } else {
    next();
  }
};

const sauceSchema = Joi.object({
  userId: Joi.string().trim().length(24).required(),
  name: Joi.string().trim().min(1).required(),
  manufacturer: Joi.string().trim().min(1).required(),
  description: Joi.string().trim().min(1).required(),
  mainPepper: Joi.string().trim().min(1).required(),
  heat: Joi.number().integer().min(1).max(10).required(),
});
exports.sauce = (req, res, next) => {
  let sauce;
  if (req.file) {
    sauce = JSON.parse(req.body.sauce);
  } else {
    sauce = req.body;
  }
  const { error, value } = sauceSchema.validate(sauce);
  if (error) {
    res.status(422).json({ error: "Requête non traitable !" });
  } else {
    next();
  }
};

const idSchema = Joi.string().trim().length(24).required();
exports.id = (req, res, next) => {
  const { error, value } = idSchema.validate(req.params.id);
  if (error) {
    res.status(422).json({ error: "Requête non traitable !" });
  } else {
    next();
  }
};

const likeSchema = Joi.object({
  userId: Joi.string().trim().length(24).required(),
  like: Joi.valid(-1, 0, 1).required(),
});
exports.like = (req, res, next) => {
  const { error, value } = likeSchema.validate(req.body);
  if (error) {
    res.status(422).json({ error: "Requête non traitable !" });
  } else {
    next();
  }
};
