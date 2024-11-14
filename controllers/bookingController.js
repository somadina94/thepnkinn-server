const Booking = require("../models/bookingModel");
const Accomodation = require("../models/accomodationModel");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const helpers = require("../util/helpers");
const Email = require("../util/email");

// CREATE A RESERVATION
exports.createBooking = catchAsync(async (req, res, next) => {
  // Get accomodation and check if dates are available
  const accomodation = await Accomodation.findOne({
    _id: req.body.accomodation,
  });

  // if (
  //   !helpers.checkAvailability(
  //     accomodation.bookedDates,
  //     req.body.startDate,
  //     req.body.endDate
  //   )
  // ) {
  //   return next(
  //     new AppError("Chosen dates are unavialble, please choose new dates", 401)
  //   );
  // }

  // Create booking
  let cautionFee = 0;
  if (accomodation.category === "apartment") {
    cautionFee = +process.env.CAUTION_FEE;
  }
  const booking = await Booking.create({
    accomodation: req.body.accomodation,
    user: req.user._id,
    amount:
      helpers.getDaysBetweenDates(req.body.startDate, req.body.endDate) *
        accomodation.pricePerNight +
      cautionFee,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    numAdults: req.body.numAdults,
    numKids: req.body.numKids,
    cautionFee,
  });

  // Update accomodation bookedDates
  accomodation.bookedDates.push({
    startDate: booking.startDate,
    endDate: booking.endDate,
  });
  await accomodation.save({ validateBeforeSave: false });

  // Send email updates to user and admin
  try {
    // Send to admin
    const adminMsg = `A customer ${req.user.name} booked ${
      accomodation.name
    } and his/her email address is ${
      req.user.email
    } and total booking amount is #${helpers.formatAmount(booking.amount)}`;
    await new Email(
      {
        name: `Admin ${process.env.COMPANY_NAME}`,
        email: process.env.ADMIN_EMAIL,
      },
      adminMsg
    ).sendBookingSuccess();
    // Send to user
    const userMsg = `You have successfully made a reservation for our accomodation named ${
      accomodation.name
    } for ${booking.numAdults} adults and ${
      booking.numKids
    } kids.\nPayment is on arrival at our address and the sum of #${helpers.formatAmount(
      booking.amount + +process.env.CAUTION_FEE
    )}.\nYou booked from ${helpers.formatDate(
      booking.startDate
    )} to ${helpers.formatDate(
      booking.endDate
    )}.\nWe will reach out to you soon!\nFor more information contact support +2347062140248/+2349087866624 or +2347062098265/ 
+2349087866625`;
    await new Email(req.user, userMsg).sendBookingSuccess();
  } catch (error) {
    console.log(error.message);
  }

  // Send response
  res.status(201).json({
    status: "success",
    message:
      "Reservation made successfully! We will get intouch with you shortly",
    data: {
      booking,
    },
  });
});

// GET ALL BOOKINGS
exports.getAllBookings = catchAsync(async (req, res, next) => {
  // Get all bookings if role is admin and only user bookings if role is user
  let booking;
  if (req.user.role === "admin") {
    booking = await Booking.find().populate(
      "accomodation",
      "name category pricePerNight location mainPhoto"
    );
  } else {
    booking = await Booking.find({ user: req.user._id }).populate(
      "accomodation",
      "name category pricePerNight location mainPhoto"
    );
  }

  // Send response
  res.status(200).json({
    status: "success",
    data: {
      booking,
    },
  });
});

// GET ONE BOOKING
exports.getOne = catchAsync(async (req, res, next) => {
  // Find booking
  const booking = await Booking.findById(req.params.id);

  // Check if it exists
  if (!booking) {
    return next(new AppError("No booking found with that id", 404));
  }

  // Send response
  res.status(200).json({
    status: "success",
    data: {
      booking,
    },
  });
});

// DELETE BOOKING
exports.deleteBooking = catchAsync(async (req, res, next) => {
  // Delete booking
  await Booking.findByIdAndDelete(req.params.id);

  // Send response
  res.status(204).json({
    status: "success",
  });
});
