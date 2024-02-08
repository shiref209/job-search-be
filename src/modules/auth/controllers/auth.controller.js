import { userModel } from "../../../db/models/user.model.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// 1-check if email/phone exists
// 2-hash password
// 3-compute username
// 4-create user
export const signup = asyncHandler(async (req, res, next) => {
  if (
    await userModel.findOne({
      $or: [{ email: req.body.email }, { phone: req.body.phone }],
    })
  ) {
    return next(new Error("Email/phone already exists", { cause: 400 }));
  }
  const hashedPassword = bcrypt.hashSync(req.body.password);
  if (!hashedPassword) return next(new Error("error", { cause: 500 }));
  req.body.userName = req.body.firstName + " " + req.body.lastName;
  req.body.password = hashedPassword;
  const user = await userModel.create(req.body);
  return res.status(201).json({ message: "User created successfully", user });
});

// 1-check if email/phone exists
// 2- compare password
// 3- generate token
// 4- update user status
// 5- return token
export const signIn = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({
    $or: [{ email: req.body.login }, { phone: req.body.login }],
  });
  if (!user) {
    return next(new Error("invalid email or password", { cause: 404 }));
  }
  const passwordMatch = bcrypt.compareSync(req.body.password, user.password);
  if (!passwordMatch) {
    return next(new Error("invalid email or password", { cause: 400 }));
  }
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.AUTH_TOKEN_KEY
  );
  user.status = "online";
  await user.save();
  return res.status(200).json({ msg: "logged in", token });
});

//1-check if email/phone in body
//2-check if email/phone exists
//3-compute full name
//4-update user
//-->status online and only owner can update is checked in auth middleware
export const updateAccount = asyncHandler(async (req, res, next) => {
  if (req.body.email) {
    if (await userModel.findOne({ email: req.body.email })) {
      return next(new Error("Email already exists", { cause: 400 }));
    }
  }
  if (req.body.phone) {
    if (await userModel.findOne({ phone: req.body.phone })) {
      return next(new Error("Phone already exists", { cause: 400 }));
    }
  }
  req.body.userName =
    (req.body.firstName || req.user.firstName) +
    " " +
    (req.body.lastName || req.user.lastName);

  const updatedUser = await userModel.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
  });
  return res.status(200).json({ message: "User updated", user: updatedUser });
});

//check owner and logged in already done in auth middleware
//1-update status to offline
//2-update isDeleted to true
//3-return message
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user.id,
    { isDeleted: true, status: "offline" },
    { new: true }
  );
  return res.status(200).json({ message: "User deleted" });
});

//check owner and logged in already done in auth middleware
//1-compare old password
//2-hash new password
//3-update password
//4-return message
export const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
  const passwordMatch = bcrypt.compareSync(req.body.oldPassword, user.password);
  if (!passwordMatch) {
    return next(new Error("invalid password", { cause: 400 }));
  }
  const hashedPassword = bcrypt.hashSync(req.body.newPassword);
  if (!hashedPassword) return next(new Error("error", { cause: 500 }));
  user.password = hashedPassword;
  await user.save();
  return res.status(200).json({ message: "Password updated" });
});

//1-check if email exists
//2-generate otp
//3-send otp to phone
//4-save otp in user
//5-return message
export const sendOtp = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("invalid email", { cause: 404 }));
  }
  const otp = Math.floor(1000 + Math.random() * 9000);
  //we should send otp to phone that we get from body
  user.otp = otp;
  await user.save();
  return res.status(200).json({ message: "otp sent to phone" });
});
//1-check if email exists
//2-check if otp is correct
//3-hash new password
//4-update password
export const checkOtp = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("invalid email", { cause: 404 }));
  }
  if (otp !== user.otp || otp === 0) {
    return next(new Error("invalid otp", { cause: 400 }));
  }
  const newHash = bcrypt.hashSync(req.body.newPassword);
  await userModel.findOneAndUpdate({ email }, { password: newHash, otp: 0 });
  return res.status(200).json({ message: "Password updated" });
});

export const getUser = asyncHandler(async (req, res, next) => {
  const user = await userModel
    .findById(req.user.id)
    .select("-password -otp -isDeleted -status ");
  return res.status(200).json({ msg: "success", user });
});

export const getAnotherUser = asyncHandler(async (req, res, next) => {
  const user = await userModel
    .findById(req.params.id)
    .select("-password -otp -isDeleted -status ");
  return res.status(200).json({ msg: "success", user });
});

export const getAllEmailAccounts = asyncHandler(async (req, res, next) => {
  const users = await userModel
    .find({ recoveryEmail: req.body.email })
    .select("-password -otp -isDeleted -status");
  return res.status(200).json({ msg: "success", users });
});
