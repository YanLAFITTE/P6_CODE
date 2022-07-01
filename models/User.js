// The Mongoose module provides several functions to manipulate documents in the MongoDB database collection.
const mongoose = require("mongoose");

// Check that email is unique.
const uniqueValidator = require("mongoose-unique-validator");

// Create a data schema that contains the desired fields for each product.
const userSchema = mongoose.Schema({
  // Check that email is unique.
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
