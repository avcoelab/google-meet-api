
const cors = require("cors");
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const meetingRoutes = require('./apis/google_meet/google_meet.routes');

const app = express();

app.use(express.json());
app.use(cors());


// MongoDB Connection

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Routes
app.use('/meetings', meetingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});