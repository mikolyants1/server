FROM node:21.5.0-alpine

WORKDIR /usr/srv/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["npm","run", "start:prod"]

EXPOSE 5000