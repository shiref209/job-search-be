import express from "express";
import bootstrap from "./src/bootstrap.js";
import dotenv from "dotenv";
import crypto from "crypto";
const app = express();
dotenv.config();
bootstrap(app, express);
const server = app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});
// TODO:: remove this
// crypto.randomBytes(48, function (err, buffer) {
//   var token = buffer.toString("hex");
//   console.log(token);
// });
