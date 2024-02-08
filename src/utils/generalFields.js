import joi from "joi";
import { Types } from "mongoose";

export const validateObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? true
    : helper.message("In-valid objectId");
};

export const generalFields = {
  password: joi
    .string()
    .min(8)
    .max(20)
    .pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/))
    .required(),
  email: joi.string().email().required(),
  idRequired: joi.string().custom(validateObjectId).required(),
  id: joi.string().custom(validateObjectId),
  file: joi.object({
    size: joi.number().positive().required(),
    path: joi.string().required(),
    filename: joi.string().required(),
    destination: joi.string().required(),
    mimetype: joi.string().required(),
    encoding: joi.string().required(),
    originalname: joi.string().required(),
    fieldname: joi.string().required(),
  }),
};
