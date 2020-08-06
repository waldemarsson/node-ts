import mongoose from "mongoose";
import { MONGODB_URI } from "./env";

export const db = mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }).catch((err) => {
    console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
    process.exit(1);
  });
