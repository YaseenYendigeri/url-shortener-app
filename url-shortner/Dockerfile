FROM node:21

WORKDIR /url-shortner

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["nodemon", "src/server.js"] my dockerfile give compose yml file 