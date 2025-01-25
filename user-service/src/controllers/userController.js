const { registerUser, loginUser } = require('../services/userService');

const register = async (req, res) => {
  try {
    const { gender, email, password, mobile } = req.body;
    console.log(req.body)
    if (!gender) {
      return res.status(400).json({ message: 'gender is required' });
    }
    if (!email) {
      return res.status(400).json({ message: 'email is required' });
    }
    if (!password) {
      return res.status(400).json({ message: 'password is required' });
    }
    if (!mobile) {
      return res.status(400).json({ message: 'mobile is required' });
    }

    const newUser = await registerUser({ gender, email, password, mobile });

    return res.status(201).json({
      message: 'User registered successfully!',
      user: newUser,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body)
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required!' });
    }

    const token = await loginUser(email, password);

    // Set session with JWT token
    req.session.token = token;

    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { register, login };
