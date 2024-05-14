import express from "express";
import Files from "../../schemas/FilesSchema";
import ImageModel from "../../schemas/ImageSchema";
import verifyJWT from "../../middlewares/verifyJWT";
const router = express.Router();

router.post("/", verifyJWT, async (req, res) => {
  const { path, name, type } = req.body;

  try {
    // Find the Files document for the user
    const files = await Files.findOne({ user: req.user._id });

    if (!files) {
      return res.status(404).json({ message: "Files not found" });
    }

    // Find the folder specified by the path
    let currentFolder = files.structure;
    for (const folderName of path) {
      const folder = currentFolder.find(
        (item) => item.name === folderName && item.type === "folder"
      );

      if (!folder || !folder.contents) {
        return res.status(404).json({ message: "Folder not found" });
      }

      currentFolder = folder.contents;
    }

    // Find the item to delete
    const itemToDelete = currentFolder.find(
      (item) => item.name === name && item.type === type
    );

    if (!itemToDelete) {
      return res.status(404).json({ message: `${type} not found` });
    }

    // Delete the item
    currentFolder = currentFolder.filter((item) => item !== itemToDelete);

    // If the item is a folder, delete its contents recursively
    if (type === "folder") {
      await deleteFolderContents(req.user._id, itemToDelete);
    } else if (type === "file") {
      // If the item is a file, also delete it from the images database
      await ImageModel.deleteOne({ user: req.user._id, data: name });
    }

    // Update the Files document with the modified structure
    files.structure = currentFolder;
    await files.save();

    return res.status(200).json({ message: `${type} deleted successfully` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Function to delete folder contents recursively
async function deleteFolderContents(userId, folder) {
  if (folder.contents && folder.contents.length > 0) {
    for (const item of folder.contents) {
      if (item.type === "file") {
        await ImageModel.deleteOne({ user: userId, data: item.name });
      } else if (item.type === "folder") {
        await deleteFolderContents(userId, item);
      }
    }
  }
}

export default router;
