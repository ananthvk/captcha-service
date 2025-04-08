FROM node:23-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --include=dev

COPY . .

RUN npm run build

EXPOSE 3000

ENV NOD_ENV=production

CMD ["npm", "run", "start:prod"]
