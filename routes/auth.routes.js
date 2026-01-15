const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.route('/signup-with-otp').post(authController.signupWithOtp);
router.route('/signup-with-token').post(authController.signupWithToken);

module.exports = router;
