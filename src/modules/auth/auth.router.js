import { Router } from "express";
import {
  checkOtp,
  deleteUser,
  getAllEmailAccounts,
  getAnotherUser,
  getUser,
  sendOtp,
  signIn,
  signup,
  updateAccount,
  updatePassword,
} from "./controllers/auth.controller.js";
import { validation } from "../../middlewares/validation.js";
import {
  checkCodeSchema,
  getAllEmailAccountsSchema,
  getAnotherUserSchema,
  sendCodeSchema,
  signInSchema,
  signupSchema,
  tokenSchema,
  updateAccountSchema,
  updatePasswordSchema,
} from "./validation/auth.validation.js";
import { auth } from "../../middlewares/auth.js";

const authRouter = Router();

authRouter
  .post("/sign-up", validation(signupSchema), signup)
  .post("/sign-in", validation(signInSchema), signIn)
  .put(
    "/",
    validation(tokenSchema, true),
    auth,
    validation(updateAccountSchema),
    updateAccount
  )
  .delete("/", validation(tokenSchema, true), auth, deleteUser)
  .patch(
    "/updatePass",
    validation(tokenSchema, true),
    auth,
    validation(updatePasswordSchema),
    updatePassword
  )
  .post("/forgetPass", validation(sendCodeSchema), sendOtp)
  .patch("/forgetPass", validation(checkCodeSchema), checkOtp)
  .get("/get-user", validation(tokenSchema, true), auth, getUser)
  .get(
    "/:id",
    validation(tokenSchema, true),
    auth,
    validation(getAnotherUserSchema),
    getAnotherUser
  )
  .get(
    "/",
    validation(tokenSchema, true),
    auth,
    validation(getAllEmailAccountsSchema),
    getAllEmailAccounts
  );
export default authRouter;
