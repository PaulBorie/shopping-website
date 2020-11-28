FROM node:10-alpine

ENV STRIPE_SECRET_KEY=sk \
    STRIPE_PUBLIC_KEY=pk \
    NODE_ENV=production

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 8080

CMD [ "node", "server.js" ]
