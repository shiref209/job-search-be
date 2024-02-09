import { model, Schema, Types } from "mongoose";

const companySchema = new Schema({
  companyName: {
    type: String,
    required: [true, "Company name is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  address: {
    type: String,
  },
  companyDescription: {
    type: String,
  },
  companyEmail: {
    type: String,
    unique: true,
    required: [true, "Company email is required"],
  },
  noOfEmployees: {
    min: { type: Number, min: 1 },
    max: { type: Number, min: 1 },
  },
  //hr created company
  HR: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  industry: {
    type: String,
  },
});

export const companyModel =
  process.env.MODE == "dev"
    ? model("Company", companySchema)
    : model.Company || model("Company", companySchema);
