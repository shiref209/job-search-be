import express from "express";
import bootstrap from "./src/bootstrap.js";
import dotenv from "dotenv";
const app = express();
dotenv.config();
bootstrap(app, express);
const server = app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});
