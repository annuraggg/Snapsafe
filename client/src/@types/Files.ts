export interface Contents extends Document {
  type: "folder" | "file";
  name: string;
  extension?: string;
  createdOn: Date;
  updatedOn: Date;
  data?: string;
  contents?: Contents[];
}

interface Files extends Document {
  user: string;
  structure: Contents[];
}

export default Files;
