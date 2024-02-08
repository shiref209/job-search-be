import { dbConnection } from "./db/connection.js";
import authRouter from "./modules/auth/auth.router.js";
import companyRouter from "./modules/company/company.router.js";
import jobRouter from "./modules/job/job.router.js";
import { globalErrorHandler } from "./utils/globalErrorHandler.js";

const bootstrap = (app, express) => {
  dbConnection();
  app.use(express.json());
  app.use("/auth", authRouter);
  app.use("/jobs", jobRouter);
  app.use("/company", companyRouter);
  app.use("*", (req, res) => {
    return res.status(404).json({ message: "invalid routing" });
  });

  // global error
  app.use(globalErrorHandler);
};
export default bootstrap;
