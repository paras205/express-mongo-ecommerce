const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "This field is required"]
    },
    email: {
      type: String,
      required: [true, "This field is required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Invalid Email"]
    },
    image: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["user", "guide", "lead", "admin"],
      default: "user"
    },
    password: {
      type: String,
      required: [true, "Password field is required"],
      minlength: 8,
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, "passwordConfrim field is required"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Password does not match"
      }
    },
    active: {
      type: Boolean,
      default: true,
      select: false
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfrim = undefined;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
