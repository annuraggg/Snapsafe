import express from "express";
import Files from "../../schemas/FilesSchema.js";
import ImageModel from "../../schemas/ImageSchema.js";
import verifyJWT from "../../middlewares/verifyJWT.js";
const router = express.Router();

router.post("/upload", verifyJWT, async (req, res) => {
  const { path, file } = req.body;

  try {
    // Check if the Files document exists for the user
    let files = await Files.findOne({ user: req.user._id });

    if (!files) {
      // Create a new Files document if it doesn't exist
      files = new Files({ user: req.user._id, structure: [] });
      await files.save();
    }

    // Find the folder specified by the path
    let currentFolder = files.structure;
    for (const folderName of path) {
      let folder = currentFolder.find(
        (item) => item.name === folderName && item.type === "folder"
      );

      if (!folder) {
        // If the folder doesn't exist, create it
        folder = {
          name: folderName,
          type: "folder",
          createdOn: new Date(),
          updatedOn: new Date(),
          contents: [],
        };
        currentFolder.push(folder);
      }

      // Update currentFolder to the found or newly created folder's contents
      currentFolder = folder.contents;
    }

    // Save the image to the ImageModel database
    const imageData = new ImageModel({ user: req.user._id, data: file.data });
    await imageData.save();

    // Add the image file to the current folder
    currentFolder.push({
      name: file.name,
      type: "file",
      createdOn: new Date(),
      updatedOn: new Date(),
      data: imageData._id,
    });

    // Update the Files document with the modified structure
    files.structure = files.structure;
    files.markModified("structure");
    await files.save();

    return res.status(200).json({ message: "Image uploaded successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/get", verifyJWT, async (req, res) => {
  const { path, name } = req.body;

  try {
    // Find the Files document for the user
    const files = await Files.findOne({ user: req.user._id });

    if (!files) {
      return res.status(404).json({ message: "Files not found" });
    }

    // If the path length is 0, the file is in the root directory
    if (path.length === 0) {
      // Find the image in the root folder
      const image = files.structure.find(
        (item) => item.name === name && item.type === "file"
      );

      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }

      // Find the image data in the ImageModel database
      const imageData = await ImageModel.findOne({ user: req.user._id });

      if (!imageData) {
        return res.status(404).json({ message: "Image data not found" });
      }

      return res.status(200).json({ data: imageData.data });
    }

    let currentFolder = files.structure;

    for (const folderName of path) {
      const folder = currentFolder.find(
        (item) => item.name === folderName && item.type === "folder"
      );

      if (!folder) {
        return res.status(404).json({ message: "Folder not found" });
      }

      currentFolder = folder.contents;
    }

    // Find the image in the current folder
    const image = currentFolder.find(
      (item) => item.name === name && item.type === "file"
    );

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Find the image data in the ImageModel database
    const imageData = await ImageModel.findOne({
      user: req.user._id,
      _id: image.data,
    });

    if (!imageData) {
      return res.status(404).json({ message: "Image data not found" });
    }

    return res.status(200).json({ data: imageData.data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
