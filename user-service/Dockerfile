# Step 1: Use the official Node.js image from DockerHub
FROM node:16

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json files into the working directory
COPY package*.json ./ 
 
# Step 4: Install the dependencies
RUN npm install 

# Step 5: Copy the rest of the application files into the container
COPY . .

# Step 6: Expose port 5000 (change if your app listens on a different port)
EXPOSE 3000

# Step 7: Set the environment variable for NODE_ENV to "production"
ENV NODE_ENV=production

# Step 8: Run the app using the command to start the server
CMD ["node", "src/server.js"]
