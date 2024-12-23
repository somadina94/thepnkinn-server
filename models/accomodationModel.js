const mongoose = require("mongoose");

const accomodationSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "Please provide a name for this accomodation"],
  },
  category: {
    type: String,
    enum: ["apartment", "room"],
    required: [true, "Please provide a category for this accomodation"],
  },
  description: {
    type: String,
    required: [true, "Please provide a description for this accomodation"],
  },
  location: {
    type: String,
    required: [true, "Please provide the location of this accomodation"],
  },
  pricePerNight: {
    type: Number,
    required: [true, "Please provide the price/night for this accomodation"],
  },
  mainPhoto: {
    type: String,
    required: [true, "Please provide a preview photo for this accomodation"],
  },
  gallery: {
    type: [String],
    required: [true, "Please provide gallery photos for this accomodation"],
  },
  bookedDates: [{ startDate: Date, endDate: Date }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  position: {
    type: Number,
    default: 0,
  },
  cautionFee: {
    type: Number,
    default: 0,
  },
});

const Accomodation = mongoose.model("Accomodation", accomodationSchema);

module.exports = Accomodation;
