const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/verify-email').post(authController.verifyEmail);

module.exports = router;
