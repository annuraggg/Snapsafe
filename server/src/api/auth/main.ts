import express from 'express';
const router = express.Router();

import signup from './signup';
import login from './login';

router.use("/signup", signup);
router.use("/login", login);

export default router;