const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

require("dotenv").config();

const userRoutes = require("./routes/users");

const meetingRoutes = require("./routes/meetings");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use("/api/users", userRoutes);

app.use("/api/meetings", meetingRoutes);

app.get("/api/health", (req, res) => {

  res.json({ status: "ok" });

});

mongoose

  .connect(process.env.MONGODB_URI)

  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  })
  
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });