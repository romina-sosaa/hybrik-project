FROM node:19

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENTRYPOINT ["npx", "ts-node", "src/index.ts"]