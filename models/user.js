"use strict"

const mongoose = require('mongoose');
const shortid = require('shortid');

// Create schema and model for users
let userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  _id: {
    type: String,
    default: shortid.generate
  }
});

module.exports = mongoose.model("Users", userSchema);