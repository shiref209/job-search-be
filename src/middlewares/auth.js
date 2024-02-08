import { userModel } from "../db/models/user.model.js";
import jwt from "jsonwebtoken";

export const roles = {
  Hr: "company_hr",
  User: "user",
};
export const auth = (authRole = Object.values(roles)) => {
  return async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      return next(new Error("Not authorized", { cause: 401 }));
    }
    const token = authorization.split(process.env.AUTH_SECRET)[1];
    if (!token) {
      return next(new Error("Not authorized", { cause: 401 }));
    }
    const decodedToken = jwt.verify(token, process.env.AUTH_TOKEN_KEY);
    if (!decodedToken.id) {
      return next(new Error("invalid id", { cause: 401 }));
    }
    const user = await userModel
      .findOne({ _id: decodedToken.id, isDeleted: false, status: "online" })
      .select(`-password`);
    if (!user) {
      return next(new Error("invalid user", { cause: 401 }));
    }
    if (!authRole.includes(user.role)) {
      return next(new Error("not authorized", { cause: 401 }));
    }
    req.user = user;
    next();
  };
};
