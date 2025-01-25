const express = require('express');
const { register, login } = require('../controllers/userController');

const router = express.Router();

// Registration Route
router.post('/register', register);

// Login Route
router.post('/login', login);

// Protected Route (example, you can add future protected routes for comments and other sections)
router.get('/protected', (req, res) => {
  if (!req.session.token) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  res.json({ message: 'You are authenticated' });
});

module.exports = router;
