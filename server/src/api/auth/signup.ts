import express from "express";
const router = express.Router();
import { z } from "zod";
import { User } from "../../schemas/UserSchema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

router.post("/", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const schema = z.object({
    firstName: z.string().nonempty(),
    lastName: z.string().nonempty(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  try {
    schema.parse({ firstName, lastName, email, password });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Please fill in all fields correctly." });
  }

  const user = await User.findOne({ email });
  if (user) {
    return res
      .status(400)
      .json({ message: "An account with this email already exists." });
  }

  try {
    const encPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: encPassword,
    });

    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.JWT_SECRET!
    );
    return res
      .cookie("token", token, {
        httpOnly: false,
        secure: true,
        sameSite: "none",
      })
      .status(201)
      .json({ token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred. Please try again." });
  }
});

export default router;
