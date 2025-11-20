const crypto = require('crypto');

const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const sendSuccess = require('../utils/responseHandler');
const HTTP_STATUS = require('./../constants/httpStatus');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const generateToken = require('../utils/tokens');
const sendEmail = require('./../utils/email');

const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  const user = await User.create({ name, email, password, passwordConfirm });

  const token = generateToken(user._id);

  user.password = undefined;

  sendSuccess(res, {
    statusCode: HTTP_STATUS.CREATED,
    data: { user },
    token,
  });
});
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1️⃣ Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', HTTP_STATUS.BAD_REQUEST));
  }

  // 2️⃣ Find user and include password
  const user = await User.findOne({ email }).select('+password');

  // 2a️⃣ If user does not exist
  if (!user) {
    return next(new AppError('Incorrect email or password', HTTP_STATUS.UNAUTHORIZED));
  }

  // 2b️⃣ Check if account is locked
  if (user.isLocked) {
    const unlockIn = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60);
    return next(new AppError(`Account locked. Try again in ${unlockIn} minutes`, 423));
  }

  // 3️⃣ Check password
  if (!(await user.isCorrectPassword(password))) {
    // ❌ Wrong password → increment loginAttempts
    await user.incrementLoginAttempts();
    return next(new AppError('Incorrect email or password', HTTP_STATUS.UNAUTHORIZED));
  }

  // 4️⃣ Successful login → reset attempts & save IP + agent
  user.loginAttempts = 0;
  user.lockUntil = undefined;
  user.lastLogin = Date.now();
  user.lastLoginIP = req.ip; // save client IP
  user.lastLoginAgent = req.headers['user-agent']; // save user agent
  await user.save({ validateBeforeSave: false });

  // 5️⃣ Generate token
  const token = generateToken(user._id);

  sendSuccess(res, {
    statusCode: HTTP_STATUS.ok,
    token,
  });
});

const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get User based on Posted email
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return next(new AppError('there is no user with email address', HTTP_STATUS.NOT_FOUND));

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) send email to the user
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${resetToken}`;

  const message = `Forgot your password? Submit a PATCHa request with your new password and password Confirm to :${resetURL}.\n If you didn't forget your password, please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (Valid for 10 min)',
      message,
    });

    sendSuccess(res, {
      statusCode: HTTP_STATUS.ok,
      message: 'Token sent to email!',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  // 1) get user based on the token
  const { token } = req.params;
  const { password, passwordConfirm } = req.body;

  const hashedPToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedPToken,
    passwordResetExpires: { $gte: Date.now() },
  });

  // 2) if toekn has not expired, ad there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', HTTP_STATUS.BAD_REQUEST));
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) update changedPasswordAt property for the user
  sendSuccess(res, {
    statusCode: HTTP_STATUS.ok,
    message: 'Password has been reset successfully.',
    token: generateToken(user._id),
  });
});

const updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get the user from collection
  const id = req.user._id;
  const { currentPassword, newPassword, passwordConfirm } = req.body;

  const user = await User.findById(id).select('+password');

  // 2) Check if Posted current password is correct
  if (!(await user.isCorrectPassword(currentPassword)))
    return next(new AppError('Your current password is wrong', HTTP_STATUS.BAD_REQUEST));

  // 3) if so, update password
  user.password = newPassword;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  // 4) Login user in, send JWT

  sendSuccess(res, {
    statusCode: HTTP_STATUS.ok,
    message: 'Password updated successfully.',
    token: generateToken(user._id),
  });
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

const updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user Posts passwords data
  const { password, passwordConfirm } = req.body;
  const { id } = req.user;

  if (password || passwordConfirm)
    return next(
      new AppError(
        'This route is not for password updates. please use `/update-my-password`',
        HTTP_STATUS.BAD_REQUEST
      )
    );

  // 2) Update user document
  // Note: We should never take all the req.body becuase someone may set the role

  const filteredBody = filterObj(req.body, 'name', 'email');
  console.log(filteredBody);
  const user = await User.findByIdAndUpdate(id, filteredBody, {
    new: true,
    runValidators: true,
  });

  sendSuccess(res, {
    statusCode: HTTP_STATUS.ok,
    message: 'Profile updated successfully.',
    data: { user },
  });
});

const deleteMe = catchAsync(async (req, res, next) => {
  const id = req.user.id;
  await User.findByIdAndUpdate(id, { active: false });

  sendSuccess(res, {
    statusCode: HTTP_STATUS.NO_CONTENT,
    message: 'User account has been deactivated.',
    data: null,
  });
});

module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateMe,
  deleteMe,
};
