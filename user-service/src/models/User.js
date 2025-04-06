import mongoose from "mongoose";


const shippingAddressSchema = new mongoose.Schema({
  line1: String,
  line2: String,
  city: String,
  state: String,
  zip: String,
  country: String,
});

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  mobile: { type: String },
  gender: { type: String },
  picture: { type: String },
  shippingAddress: shippingAddressSchema,
  auth0Id: { type: String, required: true, unique: true },
  lastLogginAt: { type: Date, default: Date.now },
  role: { type: String, enum: ["Admin", "User"], default: "User" },
});

const User = mongoose.model("User", UserSchema);

export default User;
