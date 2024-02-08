import { companyModel } from "../../../db/models/company.model.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

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
  console.log(company.HR, req.user._id);
  if (company.HR.toString() !== req.user._id.toString()) {
    return next(new Error("unauthorized", { cause: 401 }));
  }
  await companyModel.findByIdAndDelete(req.params.id);
  return res.status(200).json({ msg: "success delete" });
});
