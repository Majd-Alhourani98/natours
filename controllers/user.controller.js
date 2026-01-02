const getAllUsers = (req, res) => {
  return res.status(200).json({
    status: 'success',
    result: '<number_of_users>',
    message: 'Users retrieved successfully',
    data: { users: '<list_of_users>' },
  });
};

const createUser = (req, res) => {
  const { body: data } = req;

  console.log(data);

  return res.status(201).json({
    status: 'success',
    message: 'User created successfully',
    data: { user: '<newly_created_user>' },
  });
};

const getUser = (req, res) => {
  const { id } = req.params;

  console.log(id);

  return res.status(200).json({
    status: 'success',
    message: 'User retrieved successfully',
    data: { user: '<user>' },
  });
};

const updateUser = (req, res) => {
  const { id } = req.params;
  const { body: data } = req;

  console.log(id);
  console.log(data);

  return res.status(200).json({
    status: 'success',
    message: 'User updated successfully',
    data: { user: '<user>' },
  });
};

const deleteUser = (req, res) => {
  const { id } = req.params;

  console.log(id);

  return res.status(204).json({
    status: 'success',
    message: 'User deleted successfully',
    data: null,
  });
};

module.exports = {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
