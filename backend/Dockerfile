# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests for deterministic installs
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client and compile TypeScript
RUN npm run prisma:generate
RUN npm run build

# Production Stage
FROM node:20-alpine AS production

WORKDIR /app

# Set Node to production mode
ENV NODE_ENV=production
ENV PORT=8080

# Copy package manifests
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies first so Prisma CLI is available
RUN npm ci

# Generate Prisma Client for the production environment
RUN npx prisma generate

# Remove devDependencies to keep the image lean
RUN npm prune --omit=dev

# Copy the compiled output from the builder stage
COPY --from=builder /app/dist ./dist

# Security: Run as a non-root user
USER node

EXPOSE 8080

CMD ["npm", "start"]
