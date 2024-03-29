import { Router } from "express";
import { validation } from "../../middlewares/validation.js";
import { tokenSchema } from "../auth/validation/auth.validation.js";
import { auth, roles } from "../../middlewares/auth.js";
import {
  addCompany,
  deleteCompany,
  updateCompany,
} from "./controllers/company.controller.js";
import {
  addCompanySchema,
  deleteCompanySchema,
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
  );

export default companyRouter;
