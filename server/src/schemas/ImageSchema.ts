import { Schema, model } from "mongoose";

const ImageSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  data: {
    type: String,
    required: true,
  },
});

const ImageModel = model("Image", ImageSchema);
export default ImageModel;
