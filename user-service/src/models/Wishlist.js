import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: String, required: true },
  addedAt: { type: Date, default: Date.now },
});

const Wishlist = mongoose.model("Wishlist", WishlistSchema);

export default Wishlist;
