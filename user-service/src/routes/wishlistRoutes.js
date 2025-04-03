import express from 'express';
import {
    addToWishlistService,
    getWishlistByUserService,
    removeFromWishlistService,
  } from "../services/wishlistService.js";
  
const router = express.Router();

/**
 * @swagger
 * /wishlist/add:
 *   post:
 *     summary: Add a product to the user's wishlist.
 *     description: Adds a product to the user's wishlist using userId and productId.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "65fd2f1c9f45b01234567890"
 *               productId:
 *                 type: string
 *                 example: "product-12345"
 *     responses:
 *       201:
 *         description: Product added to wishlist successfully.
 *       400:
 *         description: userId and productId are required.
 *       500:
 *         description: Internal server error.
 */
router.post("/add", async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
      return res.status(400).json({ error: "userId and productId are required" });
    }
    const wishlistItem = await addToWishlistService(userId, productId);
    return res.status(201).json({ message: "Product added to wishlist!", data: wishlistItem });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Something went wrong!" });
  }
});

/**
 * @swagger
 * /wishlist/{userId}:
 *   get:
 *     summary: Get a user's wishlist.
 *     description: Retrieve all wishlist items for a specific user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: "65fd2f1c9f45b01234567890"
 *     responses:
 *       200:
 *         description: User wishlist retrieved successfully.
 *       404:
 *         description: User has no wishlist items.
 *       500:
 *         description: Internal server error.
 */
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const wishlist = await getWishlistByUserService(userId);
    if (!wishlist.length) {
      return res.status(404).json({ message: "No wishlist items found" });
    }
    return res.status(200).json({ message: "Wishlist retrieved successfully!", data: wishlist });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Something went wrong!" });
  }
});

/**
 * @swagger
 * /wishlist/remove:
 *   delete:
 *     summary: Remove a product from the user's wishlist.
 *     description: Removes a product from the user's wishlist by userId and productId.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "65fd2f1c9f45b01234567890"
 *               productId:
 *                 type: string
 *                 example: "product-12345"
 *     responses:
 *       200:
 *         description: Product removed from wishlist successfully.
 *       404:
 *         description: Wishlist item not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/remove", async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
      return res.status(400).json({ error: "userId and productId are required" });
    }
    const removedItem = await removeFromWishlistService(userId, productId);
    if (!removedItem) {
      return res.status(404).json({ error: "Wishlist item not found" });
    }
    return res.status(200).json({ message: "Product removed from wishlist!" });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Something went wrong!" });
  }
});

export default router;
