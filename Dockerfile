FROM node:14
WORKDIR /HotelApi
COPY package.json .
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start" ,"dev"]