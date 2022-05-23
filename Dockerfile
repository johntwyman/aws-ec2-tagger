FROM node:16-alpine3.14
WORKDIR /app
COPY package*json ./
RUN yarn --production
COPY . .
EXPOSE 8080
CMD ["yarn", "start"]
