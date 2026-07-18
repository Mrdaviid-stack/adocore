# Stage 1: Base Environment
FROM node:24-alpine AS base
WORKDIR /app

# Stage 2: Install All Dependencies (For Building)
FROM base AS deps
COPY package*.json ./
RUN npm ci

# Stage 3: Create Standalone Build
FROM base AS build
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
RUN node ace build

# Stage 4: Gather Production-Only Dependencies
FROM base AS production-deps
COPY package*.json ./
RUN npm ci --omit=dev

# Stage 5: Final Production Runtime Image
FROM base
ENV NODE_ENV=production
WORKDIR /app

# Copy built code and dependencies over
COPY --from=production-deps /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY package.json ./

EXPOSE 3333

# 🚀 THE FIX: Print the runtime environment variables into the build folder right before launching
CMD sh -c "env > build/.env && node build/bin/server.js"
