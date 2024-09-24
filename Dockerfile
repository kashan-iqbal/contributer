# Stage 1: Build Stage
FROM node:18 as builder

# Set the working directory inside the container
WORKDIR /build

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Stage 2: Production Stage
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the build output from the previous stage to the current stage
COPY --from=builder /build /app

# Expose the port on which the server will run
EXPOSE 3000


# Command to start the server
CMD ["node", "server.js"]
