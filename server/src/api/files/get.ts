import express, { Request, Response } from "express";
import verifyJWT from "../../middlewares/verifyJWT";
import Files from "../../schemas/FilesSchema";
const router = express.Router();

// Define an interface for a file/folder
interface FileFolder {
  type: string;
  name: string;
  createdOn: Date;
  updatedOn: Date;
  path: string[]; // Add path variable to indicate location within the file structure
}

router.post("/", verifyJWT, async (req: Request, res: Response) => {
  try {
    const { path }: { path: string[] } = req.body;

    const files = await Files.findOne({
      user: req.user._id,
    });

    if (!files) {
      return res.status(404).json({ error: "No files found" });
    }

    let currentFolder = files.structure;

    const fileFolders: FileFolder[] = [];

    if (path.length > 0) {
      const fullPath: string[] = [];

      for (const folderName of path) {
        const folder = currentFolder.find(
          (item) => item.name === folderName && item.type === "folder"
        );

        if (!folder || !folder.contents) {
          return res.status(404).json({ error: "Folder not found" });
        }

        // @ts-expect-error contents is not defined on type Document
        currentFolder = folder.contents;

        fullPath.push(folderName); // Track the full path
      }

      // Add files and folders with their respective paths
      for (const item of currentFolder) {
        fileFolders.push({
          type: item.type,
          name: item.name,
          createdOn: item.createdOn,
          updatedOn: item.updatedOn,
          path: fullPath.concat(item.name), // Construct the full path for the item
        });
      }
    } else {
      // Add files and folders at the root level with their respective paths
      for (const item of currentFolder) {
        fileFolders.push({
          type: item.type,
          name: item.name,
          createdOn: item.createdOn,
          updatedOn: item.updatedOn,
          path: [item.name], // Path for root level items
        });
      }
    }

    const result = {
      files: fileFolders.filter((item) => item.type === "file"),
      folders: fileFolders.filter((item) => item.type === "folder"),
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

export default router;
