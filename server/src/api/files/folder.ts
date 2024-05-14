import express from "express";
import verifyJWT from "../../middlewares/verifyJWT";
import Files from "../../schemas/FilesSchema";
const router = express.Router();

router.post("/create", verifyJWT, async (req, res) => {
  const { path, name }: { path: string[]; name: string } = req.body;

  // Check if folder name is provided and not empty
  if (name === undefined || name.trim() === "") {
    return res.status(400).send("Folder name is required");
  }

  try {
    // Find or create Files document for the user
    let files = await Files.findOne({ user: req.user._id });

    if (!files) {
      files = new Files({ user: req.user._id, structure: [] });
    }

    let currentFolder = files.structure;

    // If path is empty, add folder to root
    if (path.length === 0) {
      const folderExists = currentFolder.some(
        (folder) => folder.name === name && folder.type === "folder"
      );

      if (folderExists) {
        return res.status(400).send("Folder already exists in root directory");
      }

      currentFolder.push({
        type: "folder",
        name: name,
        createdOn: new Date(),
        updatedOn: new Date(),
        contents: [],
      });
    } else {
      // Traverse the path and create folders as necessary
      for (const folderName of path) {
        let existingFolder = currentFolder.find(
          (folder) => folder.name === folderName && folder.type === "folder"
        );

        if (!existingFolder) {
          // Create a new folder if it doesn't exist
          const newFolder = {
            type: "folder",
            name: folderName,
            createdOn: new Date(),
            updatedOn: new Date(),
            contents: [],
          };
          currentFolder.push(newFolder);
          // Update currentFolder to the new folder's contents
          currentFolder = newFolder.contents;
        } else {
          // Update currentFolder to the existing folder's contents
          currentFolder = existingFolder.contents;
        }
      }

      // Add the new folder to the current folder
      const folderExists = currentFolder.some(
        (folder) => folder.name === name && folder.type === "folder"
      );

      if (folderExists) {
        return res.status(400).send("Folder already exists at specified path");
      }

      currentFolder.push({
        type: "folder",
        name: name,
        createdOn: new Date(),
        updatedOn: new Date(),
        contents: [],
      });
    }

    // Save the updated Files document
    files.markModified("structure");
    const save = await files.save();

    return res.sendStatus(200);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
});

export default router;
