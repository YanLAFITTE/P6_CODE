// Package that allows to handle incoming files in HTTP requests.
const multer = require("multer");

// Set image format.
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Configures the format of the images and their destination.
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_").split(".")[0];
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + "_" + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage }).single("image");
