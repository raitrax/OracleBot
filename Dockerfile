FROM node:24-alpine

WORKDIR /app

# Install prod dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the rest of the bot
COPY . .

CMD ["node", "index.js"]
