FROM node:alpine

WORKDIR /

COPY package.json .

RUN npm install

COPY *.env .

COPY . .

EXPOSE 5000

CMD [ "node", "app.js" ]
