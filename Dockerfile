FROM node

WORKDIR /app

COPY . .

RUN npm install --force

ENV PORT 3002

EXPOSE $PORT

RUN npm run build