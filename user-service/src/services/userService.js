const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUserByEmail, saveUser } = require('../utils/localFileStore');

// Register user service
const registerUser = async ({ gender, email, password, mobileNumber }) => {
  const userExists = getUserByEmail(email);
  
  if (userExists) {
    throw new Error('User already exists!');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    gender,
    email,
    password: hashedPassword,
    mobileNumber,
  };

  // Save the user to the local file
  saveUser(newUser);
  // Generate JWT token
  const token = jwt.sign(
    { userId: newUser.id, email: newUser.email },
    process.env.JWT_SECRET , // You should keep this in the .env file
    { expiresIn: '1h' }
  );
  return {...newUser,token};
};

// Login user service
const loginUser = async (email, password) => {
  const user = getUserByEmail(email);

  if (!user) {
    throw new Error('User not found!');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Invalid credentials!');
  }

  const token = jwt.sign({ userId: user.email }, process.env.JWT_SECRET , { expiresIn: '1h' });
  
  return token;
};

module.exports = { registerUser, loginUser };
