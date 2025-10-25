const express = require('express');
const router = express.Router();

const userController = require('./../controllers/user.controller');

// --- Users Routes (still placeholders) ---
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getSingleUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
