//src/models/User.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  username: string;
  email: string;
  password: string;
  balance: number;
  pin: number | null;
  profilePicture?: string;
}

const userSchema: Schema<IUser> = new Schema(
  {
    fullName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 }, // Initialize balance
    pin: { type: Number, default: null }, // Initialize pin
    profilePicture: { type: String, default: null }, // Store the URL of the profile picture
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', userSchema);
