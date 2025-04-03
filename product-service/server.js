require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db'); 
const cors = require('cors');
const productRoute = require("./src/routes/productRoutes")
const inventoryRoutes = require("./src/routes/inventoryRoutes")
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger'); 
const Inventory = require('./src/models/Inventory');

const app = express();
const PORT = process.env.PORT || 3001;
connectDB();

app.use(cors());
app.use(express.json());

app.use('/products', productRoute);
app.use('/inventory', inventoryRoutes);
// Swagger UI Setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
