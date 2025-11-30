FROM node:20-slim

RUN apt-get update && apt-get install -y \
    chromium \
    chromium-driver \
    chromium-common \
    fonts-liberation \
    libgbm1 \
    libxss1 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium"

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
