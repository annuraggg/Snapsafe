import express from "express";
const router = express.Router();
import { z } from "zod";
import { User } from "../../schemas/UserSchema";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  try {
    schema.parse({ email, password });
  } catch (error) {
    return res.status(400).json({ error: "Invalid Input" });
  }

  try {
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({ error: "Invalid Credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(404).json({ error: "Invalid Credentials" });
    }

    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.JWT_SECRET!
    );

    res
      .cookie("token", token, {
        httpOnly: false,
        secure: false,
        sameSite: "none",
      })
      .json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
