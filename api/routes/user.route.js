import express from "express";
import { updateUser, deleteUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

//Api route
router.put("/update/:id", updateUser);

router.get("/test", (req, res) => {
  res.json({ message: "API running..." });
});

router.delete("/delete/:id", verifyToken, deleteUser);

export default router;
