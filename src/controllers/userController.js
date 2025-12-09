const User = require("../models/userModel.js");
const ApiError = require("../utils/ApiErrors.js");
const catchAsync = require("../utils/catchAsync.js");

exports.registerUser = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email: email.toLowerCase().trim() });
  if (exists) return next(new ApiError(400, "Email already exists"));

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
  });

  res.status(201).json({ status: true, data: user });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id;

  const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
    new: true,
    runValidators: true,
    context: "query",
  });
  if (!updatedUser)
    return next(new ApiError(404, "No user found with that ID"));

  res.status(200).json({ status: true, data: updatedUser });
});

exports.getUserList = catchAsync(async (req, res) => {
  let users = await User.find();
  res.status(200).json({ status: true, results: users.length, data: users });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ApiError(404, "No user found with that ID"));

  res.status(200).json({ status: true, data: user });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return next(new ApiError(404, "No user found with that ID"));

  res.status(200).json({ status: true, data: null });
});
