import { jobModel } from "../../../db/models/job.model.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

// 1-get data
//2-add job
//-->hr auth is done in auth middleware
export const addJob = asyncHandler(async (req, res, next) => {
  req.body.addedBy = req.user._id;
  const job = await jobModel.create(req.body);
  return res.status(201).json({ msg: "success", job });
});

//1-get data
//2-check if job exists
//3-update job
//-->hr auth is done in auth middleware
export const updateJob = asyncHandler(async (req, res, next) => {
  const job = await jobModel.findById(req.params.id);
  if (!job) {
    return next(new Error("job not found", { cause: 404 }));
  }
  Object.assign(job, req.body);
  await job.save();
  return res.status(200).json({ msg: "success", job });
});

//1-get data
//2-check if job exists
//3-delete job
export const deleteJob = asyncHandler(async (req, res, next) => {
  const job = await jobModel.findById(req.params.id);
  if (!job) {
    return next(new Error("job not found", { cause: 404 }));
  }
  await jobModel.findByIdAndDelete(req.params.id);
  return res.status(200).json({ msg: "success delete" });
});


