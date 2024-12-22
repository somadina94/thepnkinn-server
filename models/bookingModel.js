const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    accomodation: {
      type: mongoose.Schema.ObjectId,
      ref: "Accomodation",
      required: [true, "Please choose an accomodation to book"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "An accomodation must belong to a user"],
    },
    amount: {
      type: Number,
      required: [true, "Please provide an amount for this booking"],
    },
    cautionFee: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      required: [true, "Please provide a start date for this booking"],
    },
    endDate: {
      type: Date,
      required: [true, "Please provide an end date for this booking"],
    },
    numAdults: {
      type: Number,
      min: 1,
      max: 3,
      required: [true, "Please provide number of adults for this booking"],
    },
    numAdults: {
      type: Number,
      min: 1,
      max: 3,
      required: [true, "Please provide number of adults for this booking"],
    },
    numKids: {
      type: Number,
      max: 3,
      required: [true, "Please provide number of kids for this booking"],
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

bookingSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email",
  }).populate({
    path: "accomodation",
    select: "name category pricePerNight location mainPhoto",
  });
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
