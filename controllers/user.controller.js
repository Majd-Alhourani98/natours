const httpStatus = require('../constants/httpStatus');

const getAllUsers = (req, res) => {
  res.status(httpStatus.OK).json({
    success: true,
    status: 'success',
    message: 'Users retrieved successfully',
    results: '<number_of_users>',
    data: {
      users: '<list_of_users>',
    },
  });
};

const getUser = (req, res) => {
  const { id } = req.params;

  res.status(httpStatus.OK).json({
    success: true,
    status: 'success',
    message: 'User retrieved successfully',
    data: {
      tour: `<user with id: ${id}>`,
    },
  });
};

const createUser = (req, res) => {
  console.log(req.body);

  res.status(httpStatus.CREATED).json({
    success: true,
    status: 'success',
    message: 'User created successfully',
    data: {
      tour: '<newly_created_user>',
    },
  });
};

const updateUser = (req, res) => {
  const { id } = req.params;
  console.log(req.body);

  res.status(httpStatus.OK).json({
    success: true,
    status: 'success',
    message: 'User updated successfully',
    data: {
      tour: `<updated_user_with_id_${id}>`,
    },
  });
};

const deleteUser = (req, res) => {
  const { id } = req.params;

  res.status(httpStatus.NO_CONTENT).json();
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
