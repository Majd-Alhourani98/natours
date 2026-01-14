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

    username: {
      type: String,
      trim: true,
      unique: true,
      index: true,
      minlength: [3, 'Username must be at least 10 characters.'],
      maxlength: [55, 'Username must be less than 56 characters.'],
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
    /**
     * Options:
     * timestamps: Automatically adds 'createdAt' and 'updatedAt' fields.
     */
    timestamps: true,
  }
);

userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.password;

    return ret;
  },
});

/**
 * ----------------------------------
 * PRE SAVE MIDDLEWARES
 * ----------------------------------
 */

// Pre-save middleware to hash password
userSchema.pre('save', async function () {
  // 1. If password hasn't been modified or is new, skip hashing
  if (!this.isModified('password')) return;

  // 2. Hash the password with a cost of 12
  this.password = await argon2.hash(this.password, {
    type: argon2.argon2id, // Most secure variant
    memoryCost: Number(process.env.ARGON2_MEMORY_COST),
    timeCost: Number(process.env.ARGON2_TIME_COST),
    parallelism: Number(process.env.ARGON2_PARALLELISM),
  });

  // 3. Delete the passwordConfirm field so it doesn't get saved to the DB
  this.passwordConfirm = undefined;
});

/**
 * Create the User model from the schema.
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
