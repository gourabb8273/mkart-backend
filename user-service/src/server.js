const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const { auth } = require('express-openid-connect');

const userRoutes = require('./routes/userRoutes');

// Load environment variables
dotenv.config();

const app = express();
console.log(process.env.JWT_SECRET);
console.log(process.env.PORT);
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(
//   auth({
//     issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
//     baseURL: process.env.BASE_URL,
//     clientID: process.env.AUTH0_CLIENT_ID,
//     secret: process.env.SESSION_SECRET,
//     authRequired: false,
//     auth0Logout: true,
//   }),
// );

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET ,
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true, secure: false } // Set `secure: true` when deploying with HTTPS
}));

// Mount Routes
app.use('/user/api', userRoutes);

app.get('/user', (req, res) => {
  res.send('Welcome to the User Service!');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

