// import swaggerJsdoc from 'swagger-jsdoc';
// import dotenv from 'dotenv';
// dotenv.config();
const swaggerJsdoc = require('swagger-jsdoc');
const dotenv = require('dotenv');
dotenv.config();


const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Order Service API",
      version: "1.0.0",
      description: "API for user registration, login, and profile updates.",
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
export default swaggerSpec;