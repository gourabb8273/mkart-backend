const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - productId
 *         - userId
 *         - userName
 *         - rating
 *         - comment
 *       properties:
 *         productId:
 *           type: string
 *           example: "6434c123a8e4d70c5d6d1aef"
 *         userId:
 *           type: string
 *           example: "6434c2c3a8e4d70c5d6d1af0"
 *         userName:
 *           type: string
 *           example: "Sanjay Kumar Gupta"
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           example: 4
 *         comment:
 *           type: string
 *           example: "Great product! Value for money."
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /review/{productId}:
 *   post:
 *     summary: Create a new review for a product
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         example: "6434c123a8e4d70c5d6d1aef"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - userName
 *               - rating
 *               - comment
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "6434c2c3a8e4d70c5d6d1af0"
 *               userName:
 *                 type: string
 *                 example: "Sanjay Kumar Gupta"
 *               rating:
 *                 type: integer
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Amazing product!"
 *     responses:
 *       201:
 *         description: Review created successfully
 *       500:
 *         description: Server error
 */

// POST: Add a new review
router.post('/:productId', async (req, res) => {
    try {
      const { userId, userName, rating, comment } = req.body;
      const { productId } = req.params;
  
      const review = new Review({ productId, userId, userName, rating, comment });
      await review.save();
  
      res.status(201).json(review);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  /**
   * @swagger
   * /review/{productId}:
   *   get:
   *     summary: Get all reviews for a product
   *     tags: [Review]
   *     parameters:
   *       - in: path
   *         name: productId
   *         required: true
   *         schema:
   *           type: string
   *         example: "6434c123a8e4d70c5d6d1aef"
   *     responses:
   *       200:
   *         description: List of reviews
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Review'
   */
  
  // GET: Get all reviews for a product
  router.get('/:productId', async (req, res) => {
    try {
      const { productId } = req.params;
      const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
      res.status(200).json(reviews);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  /**
   * @swagger
   * /review/{reviewId}:
   *   put:
   *     summary: Update a review
   *     tags: [Review]
   *     parameters:
   *       - in: path
   *         name: reviewId
   *         required: true
   *         schema:
   *           type: string
   *         example: "6434d3cba8e4d70c5d6d1b23"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               userId:
   *                 type: string
   *                 example: "6434c2c3a8e4d70c5d6d1af0"
   *               rating:
   *                 type: integer
   *                 example: 5
   *               comment:
   *                 type: string
   *                 example: "Updated review comment."
   *     responses:
   *       200:
   *         description: Review updated
   *       404:
   *         description: Review not found
   *       500:
   *         description: Server error
   */
  
  // PUT: Update a review (only by user)
  router.put('/:reviewId', async (req, res) => {
    try {
      const { userId, rating, comment } = req.body;
      const { reviewId } = req.params;
  
      const review = await Review.findOneAndUpdate(
        { _id: reviewId, userId },
        { rating, comment, updatedAt: new Date() },
        { new: true }
      );
  
      if (!review) return res.status(404).json({ error: 'Review not found or not authorized' });
      res.status(200).json(review);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  /**
   * @swagger
   * /review/{reviewId}:
   *   delete:
   *     summary: Delete a review
   *     tags: [Review]
   *     parameters:
   *       - in: path
   *         name: reviewId
   *         required: true
   *         schema:
   *           type: string
   *         example: "6434d3cba8e4d70c5d6d1b23"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               userId:
   *                 type: string
   *                 example: "6434c2c3a8e4d70c5d6d1af0"
   *     responses:
   *       200:
   *         description: Review deleted
   *       404:
   *         description: Review not found
   *       500:
   *         description: Server error
   */
  
  // DELETE: Remove a review (only by user)
  router.delete('/:reviewId', async (req, res) => {
    try {
      const { userId } = req.body;
      const { reviewId } = req.params;
  
      const result = await Review.findOneAndDelete({ _id: reviewId, userId });
      if (!result) return res.status(404).json({ error: 'Review not found or not authorized' });
  
      res.status(200).json({ message: 'Review deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  module.exports = router;
  