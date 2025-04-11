import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import { auth } from 'express-openid-connect';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import connectDB from './config/db.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import getSecret from './services/getSecret.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
const isLocal = !process.env.AWS_EXECUTION_ENV;

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/user', (req, res) => {
  res.send('Welcome to the User Service!');
});
// Auth0 Middleware
// app.use(
//   auth({
//     issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
//     baseURL: process.env.BASE_URL,
//     clientID: process.env.AUTH0_CLIENT_ID,
//     secret: process.env.SESSION_SECRET,
//     authRequired: false,
//     auth0Logout: true,
//   })
// );

app.get('/callback', (req, res) => {
  res.send('Authentication Callback received!');
});

// Session Configuration
const startServer = async () => {
  try {
    const sessionSecret = await getSecret('SESSION_SECRET');

    if (!sessionSecret) {
      console.error('[Session] SESSION_SECRET is missing');
      process.exit(1);
    }

    app.use(
      session({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: true,
        cookie: { httpOnly: true, secure: false },
      })
    );

    // Routes
    app.use('/', userRoutes);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.use('/wishlist', wishlistRoutes);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
    });

  } catch (err) {
    console.error('[Server] Error starting server:', err.message);
    process.exit(1);
  }
};

startServer();