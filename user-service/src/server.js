const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');

// Load environment variables
dotenv.config();

const app = express();
console.log(process.env.JWT_SECRET);
console.log(process.env.PORT);
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET ,
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true, secure: false } // Set `secure: true` when deploying with HTTPS
}));

// Mount Routes
app.use('/api', userRoutes);

app.get('/user', (req, res) => {
  res.send('Welcome to the User Service!');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

