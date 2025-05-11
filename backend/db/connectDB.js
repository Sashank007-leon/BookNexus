import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGODB_URI;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoURI);
    console.log("Connected to database");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};
