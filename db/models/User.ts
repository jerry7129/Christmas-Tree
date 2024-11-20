import mongoose, { Schema, Document } from "mongoose";

export interface ILetter extends Document {
  name: string;
  content: string;
  decorationType: string;
  isPrivate: boolean;
}

export interface IUser extends Document {
  username: string;
  password: string;
  tree: {
    name: string;
    color: string;
  };
  letters: ILetter[];
}

const LetterSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    content: { type: String, required: true },
    decorationType: { type: String, required: true },
    isPrivate: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    tree: {
      name: { type: String, default: "My Tree" },
      color: { type: String, default: "green" },
    },
    letters: [LetterSchema],
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
