FROM node:21

WORKDIR /url-shortner

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "src/server.js"] 
