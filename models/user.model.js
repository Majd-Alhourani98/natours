const argon2 = require('argon2');
const mongoose = require('mongoose');

const { generateUsernameSuffix } = require('../utils/nanoid');
const { generateToken, generateOtp } = require('../utils/crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
      maxlength: [50, 'Name must be less than 50 characters'],
    },

    username: {
      type: String,
      unique: true,
      index: true,
    },

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
    timestamps: true, // <-- automatically adds `createdAt` and `updatedAt` fields
  },
);

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.emailVerificationToken;
    delete ret.emailVerificationTokenExpires;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    delete ret.emailVerificationOTP;
    delete ret.emailVerificationOTPExpires;

    return ret;
  },
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  if (!this.password) return;

  this.password = await argon2.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

userSchema.pre('save', async function () {
  if (!this.username) {
    const base = this.name.replace(/\s+/g, '-').toLowerCase();
    let username = base;

    while (await mongoose.models.User.findOne({ username }).lean()) {
      username = `${base}_${generateUsernameSuffix()}`.toLowerCase();
    }

    this.username = username;
  }
});

userSchema.methods.generateEmailVerificationToken = function () {
  const { token, hashedToken, tokenExpires } = generateToken();

  this.emailVerificationToken = hashedToken;
  this.emailVerificationTokenExpires = tokenExpires;

  return token;
};

userSchema.methods.generateEmailVerificationOtp = function () {
  const { otp, hashedOtp, otpExpires } = generateOtp();

  this.emailVerificationOTP = hashedOtp;
  this.emailVerificationOTPExpires = otpExpires;

  return otp;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
