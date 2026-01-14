const mongoose = require('mongoose');
const argon2 = require('argon2');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
      maxlength: [50, 'Name must be less than 50 characters'],
    },

    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },

    username: {
      type: String,
      unique: true,
      index: true,
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
  },

  {
    timestamps: true, // <-- automatically adds `createdAt` and `updatedAt` fields
  }
);

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    // Remove sensitive or internal fields
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

    return ret; // Ensure the transformed object is returned
  },
});

// Pre-save middleware to hash password
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  if (!this.password) return;

  this.password = await await argon2.hash(this.password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16, // 64MB - adjusts based on your server RAM
    timeCost: 3, // Iterations
    parallelism: 1, // Number of threads
  });

  this.passwordConfirm = undefined;
});

const User = mongoose.model('User', userSchema);

module.exports = User;
