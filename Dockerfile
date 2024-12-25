FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma

# Install dependencies
RUN npm install --force

# Generate Prisma Client
RUN npx prisma generate

# Copy the rest of the code
COPY . .

# Expose port
EXPOSE 3000

# Start in dev mode
CMD ["npm", "run", "dev"]