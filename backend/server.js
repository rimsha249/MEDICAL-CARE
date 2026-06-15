import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";
const app = express();
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

app.use(express.json());
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://medical-care-frontend-two.vercel.app",
      "https://medical-care-admin.vercel.app",
      "http://localhost:5173"
    ]

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true
}))

//api endpoints
app.use('/api/admin', adminRouter)

app.use('/api/doctor',doctorRouter)

app.use('/api/user', userRouter)

//local host:4000/api/admin

app.get("/", (req, res) => {
  res.send("API WORKING");
});

app.listen(port, () => {
  console.log("SERVER STARTED", port);
});