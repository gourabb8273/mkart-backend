import Wishlist from "../models/Wishlist.js";

/**
 * Add product to wishlist
 */
export const addToWishlistService = async (userId, productId) => {
  return await Wishlist.create({ userId, productId });
};

/**
 * Get wishlist by userId
 */
export const getWishlistByUserService = async (userId) => {
  return await Wishlist.find({ userId }).populate("userId", "email name");
};

/**
 * Remove product from wishlist
 */
export const removeFromWishlistService = async (userId, productId) => {
  return await Wishlist.findOneAndDelete({ userId, productId });
};
