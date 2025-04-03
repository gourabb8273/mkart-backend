const express = require('express');
const Inventory = require('../models/Inventory');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Inventory:
 *       type: object
 *       required:
 *         - productId
 *         - stockCount
 *         - updatedBy
 *       properties:
 *         productId:
 *           type: string
 *           description: Reference to the product ID
 *           example: "67dfba898a123027485727c4"
 *         stockCount:
 *           type: number
 *           description: Number of available stock
 *           example: 3
 *         updatedBy:
 *           type: string
 *           description: Name or ID of the user who updated stock
 *           example: "67deeef1bd90688e0713b8eb"
 *         lastUpdated:
 *           type: string
 *           format: date-time
 *           description: Timestamp of last update
 */

/**
 * @swagger
 * /inventory:
 *   post:
 *     summary: Add a new inventory record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Inventory'
 *     responses:
 *       201:
 *         description: Inventory added successfully
 *       500:
 *         description: Internal server error
 */
router.post('/', async (req, res) => {
  try {
    const inventory = new Inventory(req.body);
    await inventory.save();
    res.status(201).json({ message: 'Inventory added!', data: inventory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /inventory/{productId}:
 *   put:
 *     summary: Update stock count for a product
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stockCount:
 *                 type: number
 *                 example: 5
 *               updatedBy:
 *                 type: string
 *                 example: "67deeef1bd90688e0713b8eb"
 *     responses:
 *       200:
 *         description: Stock updated successfully
 *       404:
 *         description: Inventory not found
 *       500:
 *         description: Internal server error
 */
router.put('/:productId', async (req, res) => {
  try {
    const { stockCount, updatedBy } = req.body;
    const inventory = await Inventory.findOneAndUpdate(
      { productId: req.params.productId },
      { stockCount, updatedBy, lastUpdated: Date.now() },
      { new: true }
    );
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }
    res.status(200).json({ message: 'Stock updated', data: inventory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /inventory/{productId}:
 *   get:
 *     summary: Get stock details for a product
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product
 *     responses:
 *       200:
 *         description: Stock details retrieved successfully
 *       404:
 *         description: Inventory not found
 *       500:
 *         description: Internal server error
 */
router.get('/:productId', async (req, res) => {
  try {
    const inventory = await Inventory.findOne({ productId: req.params.productId });
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;