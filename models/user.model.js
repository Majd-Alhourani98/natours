const mongoose = require('mongoose');
const argon2 = require('argon2');
const { customAlphabet } = require('nanoid');

const { generateToken, generateOTP } = require('../utils/crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
      maxlength: [50, 'Name must be less than 50 characters'],
    },

    username: { type: String, trim: true, unique: true, index: true },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },

    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },

    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: 'Passwords do not match',
      },
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationTokenExpires: Date,
    emailVerificationOTP: String,
    emailVerificationOTPExpires: Date,
  },
  {
    timestamp: true,
  }
);

userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.passwordConfirm;
    delete ret.emailVerificationToken;
    delete ret.emailVerificationTokenExpires;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    delete ret.emailVerificationOTP;
    delete ret.emailVerificationOTPExpires;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
  },
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await argon2.hash(this.password);
  this.passwordConfirm = undefined;
});

const nanoidLetters = customAlphabet('abcdefghijklmnopqrstuvwxyz1234567890', 5);
userSchema.pre('save', async function () {
  if (!this.username) {
    const base = this.name.replace(/\s+/g, '-').toLowerCase();
    let username = base;
    while (await User.findOne({ username }).lean()) {
      username = `${base}_${nanoidLetters()}`.toLowerCase();
    }

    this.username = username;
  }
});

userSchema.methods.createEmailVerificationToken = function (length = 32, expiryDurationsMs = 10 * 60 * 1000) {
  const { token, hashedToken, tokenExpires } = generateToken();

  this.emailVerificationToken = hashedToken;
  this.emailVerificationTokenExpires = tokenExpires;

  return token;
};

userSchema.methods.createEmailVerificationOTP = function (length = 6, expiryDurationsMs = 10 * 60 * 1000) {
  const { otp, hashedOtp, otpExpires } = generateOTP();

  this.emailVerificationOTP = hashedOtp;
  this.emailVerificationOTPExpires = otpExpires;

  return otp;
};

userSchema.methods.rollbackEmailVerification = function () {
  this.emailVerificationOTP = undefined;
  this.emailVerificationOTPExpires = undefined;
  this.emailVerificationToken = undefined;
  this.emailVerificationTokenExpires = undefined;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
