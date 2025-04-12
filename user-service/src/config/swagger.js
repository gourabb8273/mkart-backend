import swaggerJsdoc from 'swagger-jsdoc';

const isLocal = !process.env.AWS_EXECUTION_ENV;

const serverUrl = isLocal
  ? `http://localhost:${process.env.PORT}`
  : 'http://ecs-alb-2130983042.ap-south-1.elb.amazonaws.com/users';

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
        url: serverUrl,
        description: isLocal ? "Local server" : "Production ALB URL",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
