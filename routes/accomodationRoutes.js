const express = require("express");
const authController = require("../controllers/authController");
const accomodationController = require("../controllers/accomodationController");

const router = express.Router();

router.post(
  "/create",
  accomodationController.upload.fields([
    { name: "mainPhoto", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  accomodationController.createAccomodation
);

router.get("/getAll", accomodationController.getAllAccomodations);
router.get("/getOne/:id", accomodationController.getOneAccomodation);

router.use(authController.protect);

router.patch(
  "/update/:id",
  authController.restrictTo("admin"),
  accomodationController.updateAccomodation
);

router.delete("/delete/:id", accomodationController.deleteAccomodation);

module.exports = router;
