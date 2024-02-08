import { jobModel } from "../../../db/models/job.model.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { getJobMatchQuery } from "../../../utils/getJobMatchQueries.js";

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

//can be done by either ref job to company population or aggregation
//aggregation selected to avoid ref in job model and data redunduncy and to try it :D
//stages:
//1-left join jobs with users
//2-unwind user
//3-left join users with companies
//4-unwind company
//5-remove user field
export const getAllJobsWithCompany = asyncHandler(async (req, res, next) => {
  const matchQuery = getJobMatchQuery(req);
  let pipeline = [
    {
      $lookup: {
        from: "users",
        localField: "addedBy",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true, //added as structure changed midway project and to re-assure all jobs are returned
      },
    },
    {
      $lookup: {
        from: "companies",
        localField: "user.companyId",
        foreignField: "_id",
        as: "company",
      },
    },
    {
      $unwind: {
        path: "$company",
        preserveNullAndEmptyArrays: true, //added as structure changed midway project and to re-assure all jobs are returned
      },
    },
    //filter
    {
      $match: matchQuery,
    },
    {
      $project: {
        user: 0,
      },
    },
  ];

  const jobs = await jobModel.aggregate(pipeline);
  return res.status(200).json({ msg: "success", jobs });
});
