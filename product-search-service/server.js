require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db'); 
const cors = require('cors');
const productRoute = require("./src/routes/productRoutes")
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger'); 
const app = express();
const PORT = process.env.PORT || 3004;
connectDB();

app.use(cors());

app.use(cors({
  origin: '*',  // Allow requests from the staging domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,  // If your request includes cookies or credentials
}));

app.use(express.json());
app.get('/', (req, res) => {
  res.send('Welcome to the Search Service!');
});
app.use('/search', productRoute);

// Swagger UI Setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
