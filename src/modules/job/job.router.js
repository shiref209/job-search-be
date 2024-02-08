import { Router } from "express";
import { auth, roles } from "../../middlewares/auth.js";
import { validation } from "../../middlewares/validation.js";
import { tokenSchema } from "../auth/validation/auth.validation.js";
import {
  addJobSchema,
  deleteJobSchema,
  jobApplySchema,
  updateJobSchema,
} from "./validation/job.validation.js";
import {
  addJob,
  deleteJob,
  getAllJobs,
  getAllJobsWithCompany,
  getCompanyJobs,
  jobApply,
  updateJob,
} from "./controllers/job.controller.js";
import uploadHandler, { fileValidation } from "../../utils/multer.js";

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

  .get("/all", validation(tokenSchema, true), auth(), getAllJobs) // get all jobs with filters
  .get("/", validation(tokenSchema, true), auth(), getAllJobsWithCompany) //get all jobs and filter can apply here
  .get("/:id", validation(tokenSchema, true), auth(), getCompanyJobs) //get job by id
  .post(
    "/:id",
    validation(tokenSchema, true),
    auth(roles.User),
    (req, res, next) => {
      const upload = uploadHandler({
        isSingle: true,
        fileValidation: fileValidation.file,
      });
      upload(req, res, next);
    },
    validation(jobApplySchema),
    jobApply
  );

export default jobRouter;
