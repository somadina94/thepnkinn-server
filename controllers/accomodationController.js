const Accomodation = require("../models/accomodationModel");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const multer = require("multer");
const B2 = require("backblaze-b2");

exports.upload = multer({ storage: multer.memoryStorage() });

const b2 = new B2({
  applicationKey: process.env.B2_APPLICATION_KEY,
  applicationKeyId: process.env.B2_APPLICATION_KEY_ID,
});

exports.createAccomodation = catchAsync(async (req, res, next) => {
  // Check for filrs
  const { files } = req;
  if (!files.mainPhoto || !files.gallery) {
    return next(new AppError("Incomplete informaton!", 400));
  }

  let mainPhoto = "";
  let gallery = [];

  const promises = Object.entries(files).flatMap(([fieldName, fileArray]) =>
    fileArray.map(async (file) => {
      await b2.authorize(); // Authorize with Backblaze

      const uploadUrl = await b2.getUploadUrl({
        bucketId: process.env.B2_BUCKET_ID,
      });

      const uploadFileResponse = await b2.uploadFile({
        uploadUrl: uploadUrl.data.uploadUrl,
        uploadAuthToken: uploadUrl.data.authorizationToken,
        filename: `${fieldName}-${Date.now().toString()}-${Math.random().toString()}.jpg`,
        mime: file.mimetype, // Use 'b2/x-auto' for auto-detect
        data: file.buffer, // Use in-memory file data from multer
      });

      // Create download URL
      const downloadUrl = `https://${process.env.B2_BUCKET_NAME}.s3.${process.env.B2_BUCKET_REGION}.backblazeb2.com/${uploadFileResponse.data.fileName}`;

      // Update schema properties based on the fieldName

      if (fieldName === "mainPhoto") {
        mainPhoto = downloadUrl; // Set the main photo URL
      } else if (fieldName === "gallery") {
        gallery.push(downloadUrl); // Add to the gallery array
      }
    })
  );

  await Promise.all(promises);

  // Create Accomodation
  const accomodation = await Accomodation.create({
    name: req.body.name,
    description: req.body.description,
    location: req.body.location,
    pricePerNight: req.body.pricePerNight,
    mainPhoto,
    gallery,
    category: req.body.category,
  });

  // Send response
  res.status(201).json({
    status: "success",
    message: "Accomodation created successfully",
    data: {
      accomodation,
    },
  });
});

// GET ALL ACCOMODATIONS
exports.getAllAccomodations = catchAsync(async (req, res, next) => {
  // Get all accomodations
  const accomodations = await Accomodation.find();

  // Send response
  res.status(200).json({
    status: "success",
    data: {
      accomodations,
    },
  });
});

// GET ONE ACCOMODATION
exports.getOneAccomodation = catchAsync(async (req, res, next) => {
  // Find accomodation
  const accomodation = await Accomodation.findById(req.params.id);

  // Check if not found
  if (!accomodation) {
    return next(new AppError("No accomodation found with that id", 404));
  }

  // Send response
  res.status(200).json({
    status: "success",
    data: {
      accomodation,
    },
  });
});

// DELETE ACCOMODATION
exports.deleteAccomodation = catchAsync(async (req, res, next) => {
  // Delete
  await Accomodation.findByIdAndDelete(req.params.id);

  // Send response
  res.status(204).json({
    status: "success",
    message: "accomodation deleted successfully",
  });
});
