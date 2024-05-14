import express from "express";
const router = express.Router();

router.post("/", async (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
});

export default router;