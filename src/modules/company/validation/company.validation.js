import joi from "joi";
import { generalFields } from "../../../utils/generalFields.js";

export const addCompanySchema = joi
  .object({
    companyName: joi.string().required(),
    address: joi.string(),
    companyDescription: joi.string(),
    companyEmail: joi.string().email().required(),
    noOfEmployees: joi.object({
      min: joi.number().min(1),
      max: joi.number().min(1),
    }),
    industry: joi.string(),
  })
  .required();

export const updateCompanySchema = joi
  .object({
    companyName: joi.string(),
    address: joi.string(),
    companyDescription: joi.string(),
    companyEmail: joi.string().email(),
    noOfEmployees: joi.object({
      min: joi.number().min(1),
      max: joi.number().min(1),
    }),
    industry: joi.string(),
    id: generalFields.idRequired,
  })
  .required();

export const deleteCompanySchema = joi
  .object({
    id: generalFields.idRequired,
  })
  .required();

export const getCompanyDataSchema = joi
  .object({
    id: generalFields.idRequired,
  })
  .required();
