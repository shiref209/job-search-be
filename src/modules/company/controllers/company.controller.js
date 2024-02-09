import mongoose, { Types } from "mongoose";
import { companyModel } from "../../../db/models/company.model.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { ApiFeatures } from "../../../utils/apiFeatures.js";
import { userModel } from "../../../db/models/user.model.js";
import ExcelJS from "exceljs";
import { scheduleJob } from "node-schedule";
import { formatExcel } from "../../../utils/excelFormatter.js";
// 1-check if name or email exists
// 2-add hr id from token
// 3-add company
export const addCompany = asyncHandler(async (req, res, next) => {
  if (
    await companyModel.findOne({
      $or: [
        { companyName: req.body.companyName },
        { companyEmail: req.body.companyEmail },
      ],
    })
  ) {
    return next(new Error("company already exists", { cause: 409 }));
  }
  req.body.HR = req.user._id;
  const company = await companyModel.create(req.body);
  return res.status(201).json({ msg: "success", company });
});

//1-get data
//2-check if company exists
//3-check if company is updated by HR owner
//4-check if name or email exists
//5-update company
export const updateCompany = asyncHandler(async (req, res, next) => {
  const company = await companyModel.findById(req.params.id);
  if (!company) {
    return next(new Error("company not found", { cause: 404 }));
  }
  if (company.HR.toString() !== req.user._id.toString()) {
    return next(new Error("unauthorized", { cause: 401 }));
  }
  if (
    req.body.companyName &&
    (await companyModel.findOne({ companyName: req.body.companyName }))
  ) {
    return next(new Error("company name already exists", { cause: 409 }));
  }
  if (
    req.body.companyEmail &&
    (await companyModel.findOne({ companyEmail: req.body.companyEmail }))
  ) {
    return next(new Error("email already exists", { cause: 409 }));
  }
  Object.assign(company, req.body);
  await company.save();
  return res.status(200).json({ msg: "success", company });
});

//1-get data
//2-check if company exists
//3-check if company is deleted by HR owner
//4-delete company
export const deleteCompany = asyncHandler(async (req, res, next) => {
  const company = await companyModel.findById(req.params.id);
  if (!company) {
    return next(new Error("company not found", { cause: 404 }));
  }
  if (company.HR.toString() !== req.user._id.toString()) {
    return next(new Error("unauthorized", { cause: 401 }));
  }
  await companyModel.findByIdAndDelete(req.params.id);
  return res.status(200).json({ msg: "success delete" });
});

//1-check if company exists
//2- with aggregate,
//first stage -->get company data
//second stage --> then go to users model and get users where _id matches companyId provided from company
//third stage --> then to job model and get jobs added by users id that works from
//finally remove users from company data
export const getCompanyData = asyncHandler(async (req, res, next) => {
  if (!(await companyModel.findById(req.params.id))) {
    return next(new Error("company not found", { cause: 404 }));
  }
  const company = await companyModel.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(req.params.id),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "companyId",
        as: "users",
      },
    },
    {
      $unwind: "$users",
    },
    {
      $lookup: {
        from: "jobs",
        localField: "users._id",
        foreignField: "addedBy",
        as: "jobs",
      },
    },
    {
      $project: {
        users: 0,
      },
    },
  ]);
  return res.status(200).json({ msg: "success", company });
});

//get all with feat api to search
export const searchCompany = asyncHandler(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(companyModel.find(), req.query).search();
  const companies = await apiFeatures.mongooseQuery;
  return res.status(200).json({ msg: "success", companies });
});

//1-skip company exists and check if user is HR owner
//2- with aggregate,
//first stage -->filter users that works in this company as hr
//second stage --> then go to jobs model and get jobs added by them
//third stage --> then to applications model and get applicants for each job

export const getCompanyApplications = asyncHandler(async (req, res, next) => {
  const company = await companyModel.findOne({ HR: req.user._id });
  if (!company) {
    return next(new Error("unauthorized", { cause: 401 }));
  }
  const applications = await userModel.aggregate([
    {
      $match: {
        companyId: new Types.ObjectId(company._id),
      },
    },
    {
      $lookup: {
        from: "jobs",
        localField: "_id",
        foreignField: "addedBy",
        as: "jobs",
      },
    },
    {
      $unwind: "$jobs",
    },
    {
      $lookup: {
        from: "users",
        localField: "jobs.candidates",
        foreignField: "_id",
        as: "jobs.candidatesData",
      },
    },
    {
      $addFields: {
        "jobs.candidatesData": {
          $map: {
            input: "$jobs.candidatesData",
            as: "candidate",
            in: {
              _id: "$$candidate._id",
              email: "$$candidate.email",
              firstname: "$$candidate.firstname",
              lastname: "$$candidate.lastname",
              phone: "$$candidate.phone",
              dob: "$$candidate.dob",
            },
          },
        },
      },
    },
    {
      $project: {
        hrId: "$_id",
        name: "$userName",
        hrEmail: "$email",
        jobs: {
          jobId: "$jobs._id",
          jobTitle: "$jobs.title",
          applicants: "$jobs.candidatesData",
        },
      },
    },
  ]);
  return res.status(200).json({ msg: "success", applications });
});

//same logic above but with excel and applications returned are passed to excel formatter
export const schedulerExcelApi = asyncHandler(async (req, res, next) => {
  const company = await companyModel.findOne({ HR: req.user._id });
  const job = scheduleJob(req.body.date, async function () {
    const applications = await userModel.aggregate([
      {
        $match: {
          companyId: new Types.ObjectId(company._id),
        },
      },
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "addedBy",
          as: "jobs",
        },
      },
      {
        $unwind: "$jobs",
      },
      {
        $lookup: {
          from: "users",
          localField: "jobs.candidates",
          foreignField: "_id",
          as: "jobs.candidatesData",
        },
      },
      {
        $addFields: {
          "jobs.candidatesData": {
            $map: {
              input: "$jobs.candidatesData",
              as: "candidate",
              in: {
                _id: "$$candidate._id",
                email: "$$candidate.email",
                firstname: "$$candidate.firstname",
                lastname: "$$candidate.lastname",
                phone: "$$candidate.phone",
                dob: "$$candidate.dob",
              },
            },
          },
        },
      },
      {
        $project: {
          hrId: "$_id",
          name: "$userName",
          hrEmail: "$email",
          jobs: {
            jobId: "$jobs._id",
            jobTitle: "$jobs.title",
            applicants: "$jobs.candidatesData",
          },
        },
      },
    ]);
    await formatExcel(applications);
  });
  job.invoke();
  return res.status(200).json({ msg: "success" });
});
