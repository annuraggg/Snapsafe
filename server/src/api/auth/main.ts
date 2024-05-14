import express from 'express';
const router = express.Router();

import signup from './signup';
import login from './login';
import logout from './logout';

router.use("/signup", signup);
router.use("/login", login);
router.use("/logout", logout);

export default router;