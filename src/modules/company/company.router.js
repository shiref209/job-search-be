import { Router } from "express";
import { validation } from "../../middlewares/validation.js";
import { tokenSchema } from "../auth/validation/auth.validation.js";
import { auth, roles } from "../../middlewares/auth.js";
import {
  addCompany,
  deleteCompany,
  getCompanyApplications,
  getCompanyData,
  schedulerExcelApi,
  searchCompany,
  updateCompany,
} from "./controllers/company.controller.js";
import {
  addCompanySchema,
  deleteCompanySchema,
  getCompanyDataSchema,
  updateCompanySchema,
} from "./validation/company.validation.js";

const companyRouter = Router();

companyRouter
  .post(
    "/",
    validation(tokenSchema, true),
    auth(roles.Hr),
    validation(addCompanySchema),
    addCompany
  )
  .put(
    "/:id",
    validation(tokenSchema, true),
    auth(roles.Hr),
    validation(updateCompanySchema),
    updateCompany
  )
  .delete(
    "/:id",
    validation(tokenSchema, true),
    auth(roles.Hr),
    validation(deleteCompanySchema),
    deleteCompany
  )
  .get("/", validation(tokenSchema, true), auth(), searchCompany)
  .get(
    "/companyApplications",
    validation(tokenSchema, true),
    auth(roles.Hr),
    getCompanyApplications
  )
  .get(
    "/:id",
    validation(tokenSchema, true),
    auth(roles.Hr),
    validation(getCompanyDataSchema),
    getCompanyData
  )
  .post(
    "/formatExcel",
    validation(tokenSchema, true),
    auth(roles.Hr),
    schedulerExcelApi
  );

export default companyRouter;
