FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Generate Prisma Client
RUN npm run prisma:generate

# Expose port 8000
EXPOSE 8000

# Start development server
CMD ["npm", "run", "dev"]