# Use Node.js base image
FROM node:21-alpine

# Set the working directory
WORKDIR /app

# Copy package definition files
COPY package.json package-lock.json tsconfig.json ./

# Install dependencies using npm
RUN npm install

# Copy the source code
COPY src ./src

# Build the application
RUN npm run build

# Set the entry point
ENTRYPOINT ["node", "dist/main.js"]
