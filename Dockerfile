FROM node:16
WORKDIR /opt/usr
RUN apt-get update 
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8081
CMD [ "node", "app.js" ]