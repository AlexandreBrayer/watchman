import { Schema, model } from "mongoose";

const UserModel = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}).set("timestamps", true);

export default model("User", UserModel);