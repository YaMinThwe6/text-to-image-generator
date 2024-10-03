FROM node:lts-iron

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 6001

CMD ["npm", "start"]