FROM node:20.11-alpine

WORKDIR /usr/src/app

ENV TZ=America/Sao_Paulo

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma pull db

RUN npx prisma generate

RUN npm run build

CMD ["node", "dist/server.js"]