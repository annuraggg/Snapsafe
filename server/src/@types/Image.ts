import { Document, Types } from "mongoose";

interface Image extends Document {
  user: Types.ObjectId;
  data: string;
}
