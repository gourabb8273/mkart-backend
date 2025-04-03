import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  mobile: { type: String },
  gender: { type: String },
  picture: { type: String },
  auth0Id: { type: String, required: true, unique: true },
  lastLogginAt: { type: Date, default: Date.now },
  role: { type: String, enum: ["Admin", "User"], default: "User" },
});

const User = mongoose.model("User", UserSchema);

export default User;
