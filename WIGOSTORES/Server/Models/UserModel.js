import bcrypt from "bcryptjs";
import isEmail from "validator/lib/isEmail.js";
import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  email: {
    type: "string",
    require: [true, "Please Enter your email "],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email "]
  },
  password: {
    type: "string",
    required: [true, 'Please enter a valid password'],
    minlength: [6, 'Minimum password length must be 6 characters']

  },
  isAdmin: {
    type: "boolean",
    require: true,
    default: false,
  }
},
  {
    timestamps: true,
  })

// Login
userSchema.methods.matchPassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};
// Register
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
export const User = mongoose.model("User", userSchema);