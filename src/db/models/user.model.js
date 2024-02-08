import { model, Schema } from "mongoose";

const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
  },
  userName: {
    type: String,
    required: [true, "last name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    min: [8, "Password must be at least 8 characters long"],
  },
  role: {
    type: String,
    enum: ["company_hr", "user"],
    default: "user",
    required: [true, "Role is required"],
  },
  //TODO: change type to string
  dob: Date,
  phone: {
    type: String,
    unique: true,
  },
  status: {
    type: String,
    enum: ["online", "offline"],
    default: "offline",
  },
  recoveryEmail: String,
  isDeleted: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: Number,
    default: 0,
  },
});

export const userModel =
  process.env.MODE == "dev"
    ? model("User", userSchema)
    : model.User || model("User", userSchema);
