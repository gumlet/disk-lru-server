FROM node:16.8.0-bullseye-slim

WORKDIR /lrucache

ENV NODE_ENV=production

COPY ./package.json ./package-lock.json /lrucache/

RUN npm ci && npm cache clean --force

COPY . /lrucache

EXPOSE 4001

CMD ["node", "index.js"]
