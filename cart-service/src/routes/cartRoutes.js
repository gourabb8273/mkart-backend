
const express = require('express');
const router = express.Router();
const Cart = require('../models/Carts');
/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get cart items for a specific user
 *     tags: [Cart]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         example: 67dedfce6087d0aadc956570
 *         description: The ID of the user whose cart is being retrieved
 *     responses:
 *       200:
 *         description: List of cart items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Missing or invalid userId
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: 'User ID is required' });

  try {
    const cartItems = await Cart.find({ userId }); 
    res.status(200).json(cartItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Create or update a cart item
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - productId
 *               - quantity
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "67dedfce6087d0aadc956570"
 *               productId:
 *                 type: string
 *                 example: "67dfb82a16a2922388832c10"
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Cart item created or updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 */
router.post('/', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const existingCartItem = await Cart.findOne({ userId, productId });

    if (existingCartItem) {
      existingCartItem.quantity = quantity;
      await existingCartItem.save();
      return res.status(200).json(existingCartItem);
    } else {
      const newCartItem = new Cart({ userId, productId, quantity });
      await newCartItem.save();
      return res.status(200).json(newCartItem);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create or update cart item' });
  }
});
/**
 * @swagger
 * /cart:
 *   put:
 *     summary: Update quantity of an item in the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - productId
 *               - quantity
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "67dedfce6087d0aadc956570"
 *               productId:
 *                 type: string
 *                 example: "67dfb82a16a2922388832c10"
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Quantity updated successfully
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Internal server error
 */
router.put('/', async (req, res) => {
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId || typeof quantity !== 'number') {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const updatedCart = await Cart.findOneAndUpdate(
      { userId, productId },
      { quantity },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update cart item', error: err.message });
  }
});

/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - productId
 *             properties:
 *               userId:
 *                 type: string
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item removed successfully
 *       400:
 *         description: Missing userId or productId
 *       500:
 *         description: Server error
 */
router.delete('/', async (req, res) => {
  const { userId, productId } = req.body;
  if (!userId || !productId) {
    return res.status(400).json({ message: 'userId and productId are required' });
  }

  try {
    await Cart.deleteOne({ userId, productId });
    res.status(200).json({ message: 'Item removed successfully' });
  } catch (err) {
    console.error('Error removing cart item:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;