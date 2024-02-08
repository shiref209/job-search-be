import mongoose from "mongoose";

export const dbConnection = async () => {
  await mongoose
    .connect(process.env.DB_STRING)
    .then(() => {
      console.log("Connected to the database");
    })
    .catch((error) => {
      return next(
        new Error("Error connecting to the database", { cause: 500 })
      );
    });
};
