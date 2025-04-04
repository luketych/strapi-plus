# ───────────────────────────────────────────────
# 🛠️  1. Builder Stage
# ───────────────────────────────────────────────
FROM node:18-alpine3.18 AS builder

# Installing build tools & sharp dependencies
RUN apk update && apk add --no-cache \
    build-base \
    gcc \
    autoconf \
    automake \
    zlib-dev \
    libpng-dev \
    nasm \
    bash \
    vips-dev \
    git \
    python3

WORKDIR /opt/app

# Copy package.json and lock file for caching
COPY package*.json ./

# Configure npm
RUN npm config set fetch-retry-maxtimeout 600000 -g && \
    npm install -g node-gyp

# Install dependencies with sharp support
RUN npm ci --platform=linuxmusl --arch=x64

# Copy full app
COPY . .

# Ensure correct file ownership
RUN chown -R node:node /opt/app

USER node

# Avoid OOM errors during build
ENV NODE_OPTIONS=--max-old-space-size=2048

# Build the Strapi admin panel
RUN npm run strapi:build


# ───────────────────────────────────────────────
# 📦  2. Runtime Stage
# ───────────────────────────────────────────────
FROM node:18-alpine3.18

RUN apk add --no-cache vips-dev

WORKDIR /opt/app

# Copy built app & dependencies from builder
COPY --from=builder /opt/app ./
COPY --from=builder /opt/app/node_modules ./node_modules

USER node

EXPOSE 1337

# Run in production mode
ENV NODE_ENV=production
CMD ["npm", "run", "strapi:start"]