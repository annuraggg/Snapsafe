import { Document } from "mongoose";

interface User extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default User;
