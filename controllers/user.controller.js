const getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: 'number of users',
    message: 'Users retrieved successfully',
    data: {
      users: 'list of users',
    },
  });
};

const createUser = (req, res) => {
  const userData = req.body;

  console.log('Registering new user:', userData);

  res.status(201).json({
    status: 'success',
    requestedAt: new Date().toISOString(),
    message: 'User created successfully',
    data: {
      user: userData,
    },
  });
};

const getUser = (req, res) => {
  const id = req.params.id;

  console.log(`Fetching profile for user ID: ${id}`);

  res.status(200).json({
    status: 'success',
    requestedAt: new Date().toISOString(),
    message: `User ${id} profile retrieved successfully`,
    data: {
      user: `Data for user ${id}`,
    },
  });
};

const updateUser = (req, res) => {
  const id = req.params.id;
  const updates = req.body;

  console.log(`Updating user ${id} with:`, updates);

  res.status(200).json({
    status: 'success',
    requestedAt: new Date().toISOString(),
    message: `User ${id} updated successfully`,
    data: {
      user: 'updated user data',
    },
  });
};

const deleteUser = (req, res) => {
  const id = req.params.id;

  res.status(204).json({
    status: 'success',
    requestedAt: new Date().toISOString(),
    message: `User ${id} deleted successfully`,
    data: null,
  });
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
