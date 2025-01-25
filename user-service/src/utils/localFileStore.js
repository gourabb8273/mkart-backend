const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '..', '..', 'data', 'users.json');

// Utility function to get all users from the local file
const getUsers = () => {
  if (!fs.existsSync(usersFilePath)) {
    return [];
  }
  const data = fs.readFileSync(usersFilePath, 'utf-8');
  return JSON.parse(data);
};

// Utility function to save a user to the local file
const saveUser = (user) => {
  const users = getUsers();
  users.push(user);
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
};

// Utility function to find a user by email
const getUserByEmail = (email) => {
  const users = getUsers();
  return users.find(user => user.email === email);
};

module.exports = { getUsers, saveUser, getUserByEmail };
