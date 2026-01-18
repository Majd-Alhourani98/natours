const express = require("express");

const authController = require("../controllers/auth.controller");

const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/signup-with-token").post(authController.signupWithToken);
router.route("/signup-with-otp").post(authController.signupWithOtp);

module.exports = router;
