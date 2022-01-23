
FROM node:14.18.1-alpine3.14
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD ["VUE_APP_SERVER_ENDPOINT=http://192.168.2.30:3000","npm", "run", "serve"]


