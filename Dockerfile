FROM node:18-alpine3.18 as builder

# Installing dependencies for sharp and build process
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

WORKDIR /opt/
RUN chown -R node:node /opt
COPY package.json ./

# Configure npm
RUN npm config set fetch-retry-maxtimeout 600000 -g && \
    npm config set unsafe-perm true && \
    npm install -g node-gyp

# Install dependencies with specific platform target for sharp
RUN npm install --platform=linuxmusl --arch=x64

# Set environment variables for sharp
ENV SHARP_IGNORE_GLOBAL_LIBVIPS=1

WORKDIR /opt/app
COPY . .
RUN chown -R node:node /opt/app
USER node

# Build Strapi
RUN ["npm", "run", "strapi:build"]

# Production image
FROM node:18-alpine3.18

RUN apk add --no-cache vips-dev

WORKDIR /opt/app

# Copy built application
COPY --from=builder /opt/app ./
COPY --from=builder /opt/node_modules ../node_modules

USER node

EXPOSE 1337
CMD ["npm", "run", "strapi:develop"]
