import express from 'express';
import Order from '../model/Orders.js';

const router = express.Router();
/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - products
 *               - totalAmount
 *               - paymentMode
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "67dedfce6087d0aadc956570"
 *               products:
 *                 type: array
 *                 example:
 *                   - productId: "67dfba898a123027485727c4"
 *                     name: "Women's Summer Dress"
 *                     price: 29.99
 *                     quantity: 3
 *                     image: "https://st1.bollywoodlife.com/wp-content/uploads/2024/06/comfortable-summer-dresses.jpg?impolicy=Medium_Widthonly&w=412&h=290"
 *               totalAmount:
 *                 type: number
 *                 example: 89.97
 *               paymentMode:
 *                 type: string
 *                 enum: [card, cash, upi]
 *                 example: "UPI"
 *               shippingAddress:
 *                 type: object
 *                 example:
 *                   line1: "123 Main St"
 *                   line2: "Apt 4B"
 *                   city: "Mumbai"
 *                   state: "Maharashtra"
 *                   zip: "400001"
 *                   country: "India"
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order created successfully"
 *                 orderId:
 *                   type: string
 *                   example: "67e4abcd8a1234567890efgh"
 *       500:
 *         description: Server error
 */
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders for a user
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to fetch orders for
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

export default router;
