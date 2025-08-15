# Base image
FROM node:latest

# Create app directory
WORKDIR /usr/src/app/frontend

# Copy package files first to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app files
COPY . .

# Expose the port for Vite
EXPOSE 5173

# Start the dev server
CMD ["npm", "run", "dev"]
