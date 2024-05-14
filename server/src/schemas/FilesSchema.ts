import { Schema, model } from "mongoose";

// Define a sub-schema for contents recursively
const ContentsSchema = new Schema({
  type: {
    type: String,
    enum: ["folder", "file"],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  extension: {
    type: String,
    required: false,
  },
  createdOn: {
    type: Date,
    required: true,
  },
  updatedOn: {
    type: Date,
    required: true,
  },
  data: {
    type: Schema.Types.ObjectId,
    required: false,
  },
  contents: {
    type: [this],
    required: false,
  },
});

const FilesSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  structure: [ContentsSchema],
});

const Files = model("Files", FilesSchema);

export default Files;
