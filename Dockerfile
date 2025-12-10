FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY vite.config.js ./
COPY index.html ./
COPY src ./src
COPY public ./public
COPY scripts ./scripts

RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
