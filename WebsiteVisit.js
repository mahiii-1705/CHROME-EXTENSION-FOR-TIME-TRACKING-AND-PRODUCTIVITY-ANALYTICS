const mongoose = require("mongoose");

const websiteVisitSchema = new mongoose.Schema({
  domain: String,
  duration: Number, // in seconds
  timestamp: Date
});

module.exports = mongoose.model("WebsiteVisit", websiteVisitSchema);
