import express from "express";
import Files from "../../schemas/FilesSchema";
import verifyJWT from "../../middlewares/verifyJWT";
const router = express.Router();

interface FileFolder {
  type: string;
  name: string;
  createdOn: Date;
  updatedOn: Date;
  path: string[];
}

router.post("/", verifyJWT, async (req, res) => {
  try {
    const { query }: { query: string } = req.body;

    const files = await Files.findOne({
      user: req.user._id,
    });

    if (!files) {
      return res.status(404).json({ error: "No files found" });
    }

    const searchResults: FileFolder[] = [];

    const searchImages = (folder: FileFolder[], basePath: string[]) => {
      for (const item of folder) {
        if (item.type === "file" && item.name.includes(query)) {
          searchResults.push({ ...item, path: basePath });
          // @ts-expect-error contents is not defined on type Document
        } else if (item.type === "folder" && item.contents) {
          // @ts-expect-error contents is not defined on type Document
          searchImages(item.contents, [...basePath, item.name]);
        }
      }
    };

    // @ts-expect-error
    searchImages(files.structure, []);

    return res.json({ files: searchResults });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
