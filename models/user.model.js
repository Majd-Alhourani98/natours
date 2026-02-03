const mongoose = require('mongoose');
const { hashPassword, verifyPassword } = require('../utils/argon2');
const { generateUsernameSuffix } = require('../utils/nanoid');
const { generateSecureOTP } = require('../utils/crypto');
const { signToken } = require('../utils/jwt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Your name is required.'],
      trim: true,
      minlength: [3, 'Your name must be at least 3 characters long.'],
      maxlength: [50, 'Your name cannot exceed 50 characters.'],
    },

    username: {
      type: String,
      unique: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: [true, 'Please enter your email address.'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address (example: name@email.com).',
      ],
    },

    role: {
      type: String,
      default: 'user',
      enum: ['user', 'guide', 'lead-guide', 'admin'],
    },
    password: {
      type: String,
      required: [true, 'Please create a password.'],
      select: false,
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character (@$!%*?&).',
      ],
    },

    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password.'],
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: 'Passwords do not match. Please try again.',
      },
    },

    // Verfication Email Fields
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationOTP: {
      type: String,
      select: false,
    },

    emailVerificationOTPExpiresAt: {
      type: Date,
      select: false,
    },

    passwordChangedAt: Date,

    passwordResetToken: String,
    passwordResetTokenExpiresAt: Date,
  },
  {
    // timestamps: true,
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.emailVerificationOTP;
    delete ret.emailVerificationOTPExpiresAt;

    return ret;
  },
});

userSchema.pre('save', async function () {
  // Only hash the password if it has been modified (or is new)
  // This prevents re-hashing an already hashed password
  // when updating other fields like name or email
  if (!this.isModified('password')) return;

  this.password = await hashPassword(this.password);

  this.passwordConfirm = undefined;
});

userSchema.pre('save', async function () {
  if (this.username) return;
  if (!this.isNew || !this.name) return;

  const base = this.name.replace(/\s+/g, '-').toLowerCase();
  let username = `${base}_${generateUsernameSuffix()}`;

  let doc = await User.findOne({ username }).select('_id').lean();

  if (!doc) {
    this.username = username;
    return;
  }

  let attempts = 0;

  while (doc && attempts < 5) {
    username = `${base}_${generateUsernameSuffix()}`;
    doc = await User.findOne({ username }).select('_id').lean();
    attempts++;
  }

  if (doc) username = username = `${base}_${generateUsernameSuffix(10)}`;

  this.username = username;
});

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    return parseInt(this.passwordChangedAt.getTime() / 1000, 10) > JWTTimestamp;
  }

  return false;
};

userSchema.methods.generateEmailVerificationOTP = function () {
  const { otp, hashedOTP, otpExpires } = generateSecureOTP();

  this.emailVerificationOTP = hashedOTP;
  this.emailVerificationOTPExpiresAt = otpExpires;

  return otp;
};

userSchema.methods.comparePassword = async function (plainPassword) {
  return await verifyPassword(this.password, plainPassword);
};

userSchema.methods.generateAuthToken = function () {
  return signToken({ id: this._id });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
