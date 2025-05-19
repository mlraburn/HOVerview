FROM node:18-alpine

LABEL authors="Matthew Raburn"

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY backend/package*.json ./backend/
WORKDIR /usr/src/app/backend
RUN npm install

# Create app directory
WORKDIR /usr/src/app

# Copy server.js
COPY backend/server.js ./backend/

# Copy frontend files to the public directory
COPY frontend/ ./frontend/

# Expose the port app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "backend/server.js"]

