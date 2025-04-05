import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "User Service API",
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