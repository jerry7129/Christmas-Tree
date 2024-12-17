import mongoose, { Schema, Document } from "mongoose";

export interface ILetter extends Document {
  sender: string;
  content: string;
  decorationType: string;
  isPrivate: boolean;
  position: {
    x: number;
    y: number;
  };
}

export interface IUser extends Document {
  _id: string;
  username: string;
  password: string;
  refreshToken: string;
  tree: {
    name: string;
    color: string;
  };
  letters: ILetter[];
}

const LetterSchema: Schema = new Schema(
  {
    sender: { type: String, required: true },
    content: { type: String, required: true },
    decorationType: { type: String, required: true },
    isPrivate: { type: Boolean, required: true, default: false },
    position: {
      x: { type: Number, required: true, default: 0 },
      y: { type: Number, required: true, default: 0 },
    },
  },
  { timestamps: true }
);

const UserSchema: Schema = new Schema(
  {
    id: { type: String },
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
