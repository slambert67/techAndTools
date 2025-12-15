# -------- Build stage --------
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy root package.json and lockfile
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy full repo
COPY . .

# Build the NestJS app from root
RUN npx nest build apps/aws

# -------- Production stage --------
FROM node:22-alpine

WORKDIR /app

# Copy production dependencies only
COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled app from builder
# Adjust this path if needed based on where Nest outputs the build
COPY --from=builder /app/dist ./apps/aws/dist

WORKDIR /app

# Expose port
EXPOSE 3009

# Start the app
CMD ["node", "apps/aws/dist/main.js"]
