const User = require("../models/User");
const { generateToken } = require("../utils/generateToken");
const { createError } = require("../middleware/errorMiddleware");

const register = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError("Email already registered", 400);
  }

  const user = await User.create({ name, email, password, role });
  const token = generateToken(user._id);

  return { user, token };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email, deletedAt: null });
  if (!user) {
    throw createError("Invalid credentials", 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw createError("Invalid credentials", 401);
  }

  const token = generateToken(user._id);
  return { user, token };
};

module.exports = { register, login };
