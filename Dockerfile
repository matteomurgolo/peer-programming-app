# Dockerfile for the entire project

# Use a Node.js base image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .


# Expose port 3000 for the server
EXPOSE 3000

# Start the server
CMD ["node", "server/index.js"]
