"use strict"

const mongoose = require("mongoose");

let exerciseSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: "Users",
    index: true,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  date: {
    type: Date
  },
  username: {
    type: String,
    ref: "Users"
  }
});

module.exports = mongoose.model("Exercises", exerciseSchema);