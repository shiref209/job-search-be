import { Router } from "express";
import { auth, roles } from "../../middlewares/auth.js";
import { validation } from "../../middlewares/validation.js";
import { tokenSchema } from "../auth/validation/auth.validation.js";
import {
  addJobSchema,
  deleteJobSchema,
  updateJobSchema,
} from "./validation/job.validation.js";
import {
  addJob,
  deleteJob,
  getAllJobsWithCompany,
  updateJob,
} from "./controllers/job.controller.js";

const jobRouter = Router();

jobRouter
  .post(
    "/",
    validation(tokenSchema, true),
    auth(roles.Hr),
    validation(addJobSchema),
    addJob
  )
  .put(
    "/:id",
    validation(tokenSchema, true),
    auth(roles.Hr),
    validation(updateJobSchema),
    updateJob
  )
  .delete(
    "/:id",
    validation(tokenSchema, true),
    auth(roles.Hr),
    validation(deleteJobSchema),
    deleteJob
  )
  .get("/", validation(tokenSchema, true), auth(), getAllJobsWithCompany);

export default jobRouter;
