
FROM node:latest

WORKDIR /app

COPY package*.json .

RUN npm install

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]