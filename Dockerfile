FROM node

WORKDIR /app

VOLUME /app/certs

COPY package*.json /app

RUN npm install --production --force

RUN npm i -g @nestjs/cli

COPY . .

ENV PORT 3002

EXPOSE $PORT

RUN nest build

CMD ["npm","run","start:prod"]