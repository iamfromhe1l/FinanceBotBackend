FROM node

WORKDIR /app

COPY package.json .

RUN npm install --force

COPY . .

ENV PORT 3002

EXPOSE $PORT

RUN npm run build

CMD ["npm","run","start:prod"]