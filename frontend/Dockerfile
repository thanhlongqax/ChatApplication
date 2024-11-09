FROM node:16

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Install serve to serve the app
RUN npm install -g serve

# Expose cổng 3003 cho container
EXPOSE 3003

# Command to serve the application
CMD ["serve", "-s", "build", "-l", "3003"]