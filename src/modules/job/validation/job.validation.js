import joi from "joi";
import { generalFields } from "../../../utils/generalFields.js";

export const addJobSchema = joi
  .object({
    jobTitle: joi.string().required(),
    jobLocation: joi.string().valid("remote", "on-site", "hybrid"),
    workingTime: joi.string().valid("full-time", "part-time"),
    seniorityLevel: joi
      .string()
      .valid("junior", "mid-level", "senior", "team-lead", "cto"),
    jobDescription: joi.string(),
    technicalSkills: joi.array().items(joi.string()),
    softSkills: joi.array().items(joi.string()),
  })
  .required();

export const updateJobSchema = joi
  .object({
    id: generalFields.idRequired,
    jobTitle: joi.string(),
    jobLocation: joi.string().valid("remote", "on-site", "hybrid"),
    workingTime: joi.string().valid("full-time", "part-time"),
    seniorityLevel: joi
      .string()
      .valid("junior", "mid-level", "senior", "team-lead", "cto"),
    jobDescription: joi.string(),
    technicalSkills: joi.array().items(joi.string()),
    softSkills: joi.array().items(joi.string()),
  })
  .required();

export const deleteJobSchema = joi
  .object({
    id: generalFields.idRequired,
  })
  .required();
