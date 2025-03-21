require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./apis/user/user.routes");
const meetingRoutes = require("./apis/google_meet/google_meet.routes");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api/auth", authRoutes);
app.use("", meetingRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
