import express from "express";
const router = express.Router();

import get from "./get";
import folder from "./folder";
import deleteCommand from "./delete";
import image from "./image";
import search from "./search";

router.use("/get", get);
router.use("/folder", folder);
router.use("/delete", deleteCommand);
router.use("/image", image);
router.use("/search", search);

export default router;
