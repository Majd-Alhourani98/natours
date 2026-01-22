const bcrypt = require('bcryptjs');

const User = require('../models/user.model');

const signup = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    const user = await User.create({ name, email, password, passwordConfirm });

    user.password = await bcrypt.hash(user.password, 12);
    user.passwordConfirm = await bcrypt.hash(user.passwordConfirm, 12);
    await new Promise(res => setTimeout(res, 10000));
    await user.save({ validateBeforeSave: false });

    res.status(201).json({
      status: 'success',
      message: 'User created successfully. Welcome aboard!',
      requestedAt: new Date().toISOString(),
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

module.exports = { signup };
