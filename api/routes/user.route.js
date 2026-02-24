import express from "express";
import { updateUser } from "../controllers/user.controller.js";

const router = express.Router();

router.put("/update/:id", updateUser);

//Api route
router.get("/test", (req, res) => {
  res.json({ message: "API running..." });
});

export default router;
