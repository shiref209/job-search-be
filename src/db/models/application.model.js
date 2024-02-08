import { Schema, model } from "mongoose";

const applicationSchema = new Schema({
  jobId: {
    type: Schema.Types.ObjectId,
    ref: "Job",
    required: [true, "Job id is required"],
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User id is required"],
  },
  userTechSkills: {
    type: [String],
  },
  userSoftSkills: {
    type: [String],
  },
  userResume: {
    type: Object,
    required: [true, "User resume is required"],
  },
});

const applicationModel =
  process.env.MODE == "dev"
    ? model("Application", applicationSchema)
    : model.Application || model("Application", applicationSchema);

export default applicationModel;
