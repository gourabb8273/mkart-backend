const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Product Service API",
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