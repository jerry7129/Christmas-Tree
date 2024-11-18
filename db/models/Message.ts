import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  name: string;
  message: string;
  decorationType: string;
  isPrivate: boolean;
}

const MessageSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    message: { type: String, required: true },
    decorationType: { type: String, required: true },
    isPrivate: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IMessage>("Message", MessageSchema);
