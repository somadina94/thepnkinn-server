const User = require("../models/userModel");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");

// GET ALL USERS
exports.getAllUsers = catchAsync(async (req, res, next) => {
  // Fetch users
  const users = await User.find({ role: "user" });

  // Send response
  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

// GET ONE USER
exports.getOneUser = catchAsync(async (req, res, next) => {
  // Get user
  const user = await User.findById(req.params.id);

  // Return error is no user with id
  if (!user) {
    return next(new AppError("No user found with that Id", 404));
  }

  // Send response
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// UPDATE USER
exports.updateMe = catchAsync(async (req, res, next) => {
  // Check if body has password field and return error
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError("You cannot update password with this route", 401)
    );
  }

  // Find and update user
  const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
  });

  // Send response
  res.status(200).json({
    status: "success",
    message: "Your account has been updated successfully",
    data: {
      user: updatedUser,
    },
  });
});

// GET ME
exports.getMe = catchAsync(async (req, res, next) => {
  // Get current user
  const user = req.user;

  // Send response
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
