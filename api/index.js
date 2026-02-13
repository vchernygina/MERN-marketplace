import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running...");
});

app.listen(3000, () => {
  console.log("Server running on port 3000!!");
});
