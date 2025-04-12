// import dotenv from 'dotenv';
// dotenv.config();
// import express from 'express';
// import cors from 'cors';
// import mongoose from 'mongoose';
// import swaggerUi from 'swagger-ui-express';
// import swaggerSpec from './src/config/swagger.js';
// import cartRoutes from './src/routes/cartRoutes.js';
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger.js');
const cartRoutes = require('./src/routes/cartRoutes.js');

const connectDB = require('./src/config/db'); 

connectDB();

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log('MongoDB connected for Order Service'))
//   .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Cart Service!');
});

app.use('/carts', cartRoutes);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Cart Service running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
