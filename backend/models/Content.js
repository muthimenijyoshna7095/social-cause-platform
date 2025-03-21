const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: String,
  description: String,
  link: String,
  location: { lat: Number, lng: Number }, // New field for coordinates
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Content', contentSchema);