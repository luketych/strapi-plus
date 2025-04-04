# ─────────────────────────────────────────────
# 🧱 1. Base Image
# ─────────────────────────────────────────────
FROM node:18-alpine3.18

# 🛠 Install system dependencies (for sharp & build tools)
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

# ─────────────────────────────────────────────
# 🌍 2. Set Environment
# ─────────────────────────────────────────────
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# ─────────────────────────────────────────────
# 📁 3. Set up working directory
# ─────────────────────────────────────────────
WORKDIR /opt/app
RUN chown -R node:node /opt/app

# ─────────────────────────────────────────────
# 📦 4. Install dependencies
# ─────────────────────────────────────────────
# Copy only the files needed to install dependencies
COPY package.json ./
# (optional) COPY package-lock.json ./

# Add retry config + build sharp for the current architecture
RUN npm install -g node-gyp && \
    npm config set fetch-retry-maxtimeout 600000 -g && \
    npm install --build-from-source

# Update PATH for npm binaries
ENV PATH /opt/app/node_modules/.bin:$PATH

# ─────────────────────────────────────────────
# 📁 5. Copy project files and build
# ─────────────────────────────────────────────
COPY . .
RUN chown -R node:node /opt/app

# Use node user from here on
USER node

# Optional: only build if in production
RUN if [ "$NODE_ENV" = "production" ]; then npm run strapi:build; fi

# ─────────────────────────────────────────────
# 🚀 6. Start Strapi
# ─────────────────────────────────────────────
EXPOSE 1337

# Default to dev mode, override via docker-compose
CMD ["npm", "run", "strapi:develop"]
