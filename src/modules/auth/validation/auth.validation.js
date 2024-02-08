import joi from "joi";
import joiDate from "@joi/date";
import { generalFields } from "../../../utils/generalFields.js";
import { getAllEmailAccounts } from "../controllers/auth.controller.js";

const joiBase = joi.extend(joiDate);

export const tokenSchema = joi
  .object({
    authorization: joi
      .string()
      .pattern(
        new RegExp(
          /^secret_[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/
        )
      )
      .required(),
  })
  .required();

export const signupSchema = joi
  .object({
    firstName: joi.string().min(3).max(15).required(),
    lastName: joi.string().min(3).max(15).required(),
    email: generalFields.email,
    password: generalFields.password,
    cPassword: joi.ref("password"),
    dob: joiBase.date().format("YYYY-MM-DD").max(new Date()),
    phone: joi.string().min(5).max(15).regex(/^\d+$/),
    recoveryEmail: joi.string().email(),
    role: joi.string().valid("company_hr", "user").required(),
    companyId: joi.when("role", {
      is: "company_hr",
      then: generalFields.idRequired,
      otherwise: joi.forbidden(),
    }),
  })
  .required();

export const signInSchema = joi
  .object({
    login: joi
      .alternatives()
      .try(joi.string().email(), joi.string().min(5).max(15).regex(/^\d+$/))
      .required(),
    password: generalFields.password,
  })
  .required();

export const updateAccountSchema = joi
  .object({
    firstName: joi.string().min(3).max(15),
    lastName: joi.string().min(3).max(15),
    email: generalFields.email,
    phone: joi.string().min(5).max(15).regex(/^\d+$/),
    dob: joiBase.date().format("YYYY-MM-DD").max(new Date()),
    recoveryEmail: joi.string().email(),
  })
  .required();

export const updatePasswordSchema = joi
  .object({
    oldPassword: generalFields.password,
    newPassword: generalFields.password,
    cNewPassword: joi.ref("newPassword"),
  })
  .required();

export const sendCodeSchema = joi
  .object({
    email: generalFields.email,
  })
  .required();

export const checkCodeSchema = joi
  .object({
    otp: joi.number().positive().required(),
    email: generalFields.email,
    newPassword: generalFields.password,
    cPassword: joi.ref("newPassword"),
  })
  .required();

export const getAnotherUserSchema = joi
  .object({
    id: generalFields.idRequired,
  })
  .required();

export const getAllEmailAccountsSchema = joi
  .object({
    email: generalFields.email,
  })
  .required();
