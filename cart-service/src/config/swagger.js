const swaggerJsdoc = require('swagger-jsdoc');
const dotenv = require('dotenv');
dotenv.config();

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Cart Service API",
      version: "1.0.0",
      description: "API for product catelog to manage product.",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}` ,
        description: "Local server",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;