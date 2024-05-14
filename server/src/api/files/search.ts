import express from "express";
import Files from "../../schemas/FilesSchema";
import verifyJWT from "../../middlewares/verifyJWT";
const router = express.Router();

interface FileFolder {
  type: string;
  name: string;
  createdOn: Date;
  updatedOn: Date;
  path: string[]; // Add path variable to indicate location within the file structure
}

router.post("/", verifyJWT, async (req, res) => {
  try {
    const { query }: { query: string } = req.body;
    console.log(query);

    const files = await Files.findOne({
      user: req.user._id,
    });

    if (!files) {
      return res.status(404).json({ error: "No files found" });
    }

    const searchResults: FileFolder[] = [];


    return res.json({ searchResults });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
