FROM node:22-alpine3.22

WORKDIR /usr/local/grocery_store_app

COPY ./package.json ./tsconfig.json ./
RUN npm install

COPY ./src ./src

EXPOSE 3001

CMD ["sh", "-c", "npm run run-initialization-script && npm run start"]