const User = require('../models/user.model');

const signup = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { user: user },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.messsage,
    });
  }
};

module.exports = { signup };
