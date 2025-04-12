# Use an official lightweight Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install  dependencies
RUN npm install

# Copy  application code to the container
COPY . .

# Expose port
EXPOSE 3003

# Command to run your application
CMD ["node", "server.js"]
