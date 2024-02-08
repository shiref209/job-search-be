import { jobModel } from "../../../db/models/job.model.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import cloudinary from "../../../utils/cloudinary.js";
import { getJobMatchQuery } from "../../../utils/getJobMatchQueries.js";
import applicationModel from "../../../db/models/application.model.js";
import { companyModel } from "../../../db/models/company.model.js";
import { Types } from "mongoose";
import { ApiFeatures } from "../../../utils/apiFeatures.js";

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

//can be done by either ref job to company population (better solution for dynamic feature api) or aggregation
//aggregation selected to avoid ref in job model and data redunduncy and to try it :D
//stages:
//1-left join jobs with users
//2-unwind user
//3-left join users with companies
//4-unwind company
//5-apply match query
//6-remove user field
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
//1- check if company exists
//2- Aggregate
//-->with companyId join with user
// match with company id
// then join user with job and match with params company id
export const getCompanyJobs = asyncHandler(async (req, res, next) => {
  if (!(await companyModel.findById(req.params.id))) {
    return next(new Error("company not found", { cause: 404 }));
  }
  let pipeLine = [
    {
      $lookup: {
        from: "users",
        localField: "addedBy",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $match: {
        "user.companyId": new Types.ObjectId(req.params.id),
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
      $unwind: "$company",
    },
    {
      $project: {
        user: 0,
        company: 0,
      },
    },
  ];
  const jobs = await jobModel.aggregate(pipeLine);
  return res.status(200).json({ msg: "success", jobs });
});

export const getAllJobs = asyncHandler(async (req, res, next) => {
  const featureApi = new ApiFeatures(jobModel.find(), req.query).filter();
  const jobs = await featureApi.mongooseQuery;
  return res.status(200).json({ msg: "success", jobs });
});
//1-check if job exists
//2-check if user applied before
//3-upload file "required"
//4-push user to job candidates
//5-add application
export const jobApply = asyncHandler(async (req, res, next) => {
  const job = await jobModel.findById(req.params.id);
  if (!job) {
    return next(new Error("job not found", { cause: 404 }));
  }
  if (job.candidates.includes(req.user._id)) {
    return next(new Error("user already applied", { cause: 400 }));
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `job-search-route/${job._id}/${req.user._id}`,
    }
  );
  if (!secure_url) {
    return next(new Error("file not found", { cause: 400 }));
  }
  req.body.userResume = { secure_url, public_id };
  req.body.userId = req.user._id;
  req.body.jobId = req.params.id;
  // push user to job candidates
  job.candidates.push(req.user._id);
  await job.save();
  const application = await applicationModel.create(req.body);
  return res.status(201).json({ msg: "success", application });
});
