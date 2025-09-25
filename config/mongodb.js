import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true); // Prevent deprecation warning

    await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`, {
    });

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1); // Exit process if DB connection fails
  }
};

export default connectDB;
