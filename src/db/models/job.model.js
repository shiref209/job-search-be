import { Schema, Types, model } from "mongoose";

const jobSchema = new Schema({
  jobTitle: {
    type: String,
    required: [true, "Job title is required"],
  },
  jobLocation: {
    type: String,
    enum: ["remote", "on-site", "hybrid"],
    lowercase: true,
    trim: true,
  },
  workingTime: {
    type: String,
    enum: ["full-time", "part-time"],
    lowercase: true,
    trim: true,
  },
  seniorityLevel: {
    type: String,
    enum: ["junior", "mid-level", "senior", "team-lead", "cto"],
    lowercase: true,
    trim: true,
  },
  jobDescription: {
    type: String,
  },
  technicalSkills: {
    type: [String],
  },
  softSkills: {
    type: [String],
  },
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Job must be added by a user"],
  },
  candidates: [
    {
      type: Types.ObjectId,
      ref: "User",
    },
  ],
});

export const jobModel =
  process.env.MODE == "dev"
    ? model("Job", jobSchema)
    : model.Job || model("Job", jobSchema);
