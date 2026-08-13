import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDb = async () => {
  try {
    const conn = await mongoose.connect(ENV.DB_URL);

    console.log("MongoDB connected");
    console.log(conn.connection.host);
  } catch (error) {
    console.log("DB Error:", error.message);
  }
};