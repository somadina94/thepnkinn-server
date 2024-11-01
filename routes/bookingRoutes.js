const express = require("express");
const authController = require("../controllers/authController");
const bookingController = require("../controllers/bookingController");

const router = express.Router();

router.use(authController.protect);

router.post("/create", bookingController.createBooking);
router.get("/getAll", bookingController.getAllBookings);
router.get("/getOne/:id", bookingController.getOne);
router.delete("/delete/:id", bookingController.deleteBooking);

module.exports = router;
