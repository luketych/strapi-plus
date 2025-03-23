FROM node:20-alpine

# Install dependencies required for node-gyp
RUN apk add --no-cache python3 make g++ 

WORKDIR /app

COPY package*.json ./
COPY .nvmrc ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build admin UI
RUN npm run build

EXPOSE 1337

CMD ["npm", "run", "develop"]
