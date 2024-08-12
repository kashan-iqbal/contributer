import mongoose, { Schema, Document } from "mongoose";
import { boolean } from "zod";

export interface Messages extends Document {
  content: string;
  created: Date;
}

const MesssagesSchema: Schema<Messages> = new Schema({
  content: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

 interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isAcceptMessage: boolean;
  isVerified: boolean;
  message: Messages[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    trim: true,
    required: [true, "username is required"],
    unique: true,
  },
  email: {
    type: String,
    trim: true,
    required: [true, "email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "verified code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Password is required"],
  },
  isVerified: {
    type: Boolean,
    required: [true, "verified user is required"],
  },
  isAcceptMessage: {
    type: Boolean,
    default: true,
  },
  message: [MesssagesSchema],
});

export const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model("User", UserSchema);
