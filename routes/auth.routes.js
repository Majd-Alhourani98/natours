const express = require('express');
const router = express.Router();

const authController = require('./../controllers/auth.controller');
const authMiddleware = require('./../middlewares/auth.middleware');

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/forgot-password').post(authController.forgotPassword);
router.route('/reset-password/:token').patch(authController.resetPassword);
router.route('/update-my-password').patch(authMiddleware.protect, authController.updatePassword);

module.exports = router;
