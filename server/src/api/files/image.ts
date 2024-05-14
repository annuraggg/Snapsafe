import express from "express";
import Files from "../../schemas/FilesSchema.js";
import ImageModel from "../../schemas/ImageSchema.js";
import verifyJWT from "../../middlewares/verifyJWT.js";
const router = express.Router();

router.post("/upload", verifyJWT, async (req, res) => {
  const { path, file } = req.body;

  try {
    let files = await Files.findOne({ user: req.user._id });

    if (!files) {
      files = new Files({ user: req.user._id, structure: [] });
      await files.save();
    }

    let currentFolder = files.structure;
    for (const folderName of path) {
      let folder = currentFolder.find(
        (item) => item.name === folderName && item.type === "folder"
      );

      if (!folder) {
        // @ts-expect-error contents is not defined on type Document
        folder = {
          name: folderName,
          type: "folder",
          createdOn: new Date(),
          updatedOn: new Date(),
          contents: [],
        };

        // @ts-expect-error contents is not defined on type Document
        currentFolder.push(folder);
      }

      // @ts-expect-error contents is not defined on type Document
      currentFolder = folder.contents;
    }

    const imageData = new ImageModel({ user: req.user._id, data: file.data });
    await imageData.save();

    currentFolder.push({
      name: file.name,
      type: "file",
      createdOn: new Date(),
      updatedOn: new Date(),
      data: imageData._id,
    });

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
  console.log(path, name);

  try {
    const files = await Files.findOne({ user: req.user._id });

    if (!files) {
      return res.status(404).json({ message: "Files not found" });
    }

    if (path.length === 0) {
      const image = files.structure.find(
        (item) => item.name === name && item.type === "file"
      );

      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }

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

      // @ts-expect-error contents is not defined on type Document
      currentFolder = folder.contents;
    }

    const image = currentFolder.find(
      (item) => item.name === name && item.type === "file"
    );

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

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
