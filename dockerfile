FROM node:16-alpine

WORKDIR /app

COPY package.json ./

COPY . .

RUN yarn install --production

RUN yarn build

EXPOSE 3000

CMD [ "yarn", "start" ]