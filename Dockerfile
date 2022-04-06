FROM node:16-alpine3.14
RUN apk add --no-cache bash
WORKDIR /app
COPY package*json ./
RUN yarn
COPY . .
EXPOSE 8080
CMD ["yarn", "start"]