const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/signUp", authController.signUp);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/resetPassword", authController.resetPassowrd);

router.use(authController.protect);

router.patch("/updatePassword", authController.updatePassword);

router.get(
  "/getAllUsers",
  authController.restrictTo("admin"),
  userController.getAllUsers
);

router.get(
  "/getOneUser/:id",
  authController.restrictTo("admin"),
  userController.getOneUser
);

router.get("/me", userController.getMe);

router.patch("/updateMe", userController.updateMe);
router.patch("/make-admin/:id", userController.makeAdmin);

router.delete(
  "/delete/:id",
  authController.restrictTo("admin"),
  userController.deleteUser
);

module.exports = router;
