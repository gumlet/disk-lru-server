FROM node:16.8.0-bullseye-slim

WORKDIR /lrucache

ENV NODE_ENV=production

RUN apt-get update && apt-get install -y libjemalloc2

COPY ./package.json ./package-lock.json /lrucache/

RUN npm ci && npm cache clean --force

COPY . /lrucache

# uses jemalloc memory allocator
ENV LD_PRELOAD=/usr/lib/x86_64-linux-gnu/libjemalloc.so.2

EXPOSE 4001

CMD ["node", "index.js"]
