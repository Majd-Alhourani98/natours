const express = require('express');
const router = express.Router();

const authController = require('./../controllers/auth.controller');

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/forgot-password').post(authController.forgotPassword);
router.route('/reset-password').post(authController.resetPassword);

module.exports = router;
