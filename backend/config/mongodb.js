import mongoose from "mongoose";

const connectDB = async () => {
  try {

    mongoose.connection.on("connected", () => {
      console.log("DATABASE CONNECTED");
    });

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "medicohub"
    });

  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
};

export default connectDB;