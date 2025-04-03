import express  from 'express';
import { saveUserService, updateUserService, getAllUsersService }from '../services/userService.js';

const router = express.Router();

/**
 * @swagger
 * /save:
 *   post:
 *     summary: Save a complete user profile.
 *     description: Creates or updates a user's profile data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               profile:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "John Doe"
 *                   email:
 *                     type: string
 *                     example: "john.doe@example.com"
 *                   mobile:
 *                     type: string
 *                     example: "1234567890"
 *                   gender:
 *                     type: string
 *                     example: "Male"
 *                   picture:
 *                     type: string
 *                     example: "https://example.com/profile.jpg"
 *                   role:
 *                     type: string
 *                     example: "User"
 *               auth0Id:
 *                 type: string
 *                 example: "auth0|1234567890"
 *               isLoggedIn:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: User saved successfully.
 *       400:
 *         description: Profile and email are required.
 *       500:
 *         description: Internal server error.
 */
router.post('/save', async (req, res) => {
  try {
    const { profile, auth0Id, isLoggedIn } = req.body;
    if (!profile || !profile.email) {
      return res.status(400).json({ error: 'Profile and email are required' });
    }
    const savedUser = await saveUserService({ profile, auth0Id, isLoggedIn });
    return res.status(201).json({ message: 'User saved successfully!', data: savedUser });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Something went wrong!' });
  }
});

/**
 * @swagger
 * /update:
 *   patch:
 *     summary: Update a user profile.
 *     description: Partially update user profile fields.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               name:
 *                 type: string
 *                 example: "John Doe Updated"
 *               mobile:
 *                 type: string
 *                 example: "0987654321"
 *               gender:
 *                 type: string
 *                 example: "Male"
 *               picture:
 *                 type: string
 *                 example: "https://example.com/new-profile.jpg"
 *               role:
 *                 type: string
 *                 example: "Admin"
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       400:
 *         description: Email is required for updating the profile.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.patch('/update', async (req, res) => {
  try {
    const { email, ...updates } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required for updating the profile' });
    }
    const updatedUser = await updateUserService(email, updates);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({ message: 'User updated successfully!', data: updatedUser });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Something went wrong!' });
  }
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: Retrieve all users.
 *     description: Returns a list of all user profiles stored in the database.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error.
 */
router.get('/', async (req, res) => {
  try {
    const users = await getAllUsersService();
    return res.status(200).json({ message: 'Users retrieved successfully!', data: users });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Something went wrong!' });
  }
});

export default router;
