require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db'); 
const cors = require('cors');
const cartRoutes = require("./src/routes/cartRoutes");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger'); 

const app = express();
const PORT = process.env.PORT || 3002;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/cart', cartRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Cart Service!' });
});


app.listen(PORT, () => {
  console.log(`Cart Service running on port ${PORT}`);
});
