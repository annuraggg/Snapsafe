import { Document, Types } from "mongoose";

interface Contents extends Document {
  type: "folder" | "file";
  name: string;
  extension?: string;
  createdOn: Date;
  updatedOn: Date;
  data?: string;
  contents?: Contents[];
}

interface Files extends Document {
  user: Types.ObjectId;
  structure: Contents[];
}

export default Files;
