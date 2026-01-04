const express = require('express');

const userController = require('../controllers/user.controller');

const router = express.Router();

router.param('id', (req, res, next, value) => {
  console.log(value);

  next();
});

router.route('/').get(userController.getAllUsers).post(userController.createUser);
router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

module.exports = router;
