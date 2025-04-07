FROM node:20.5.1-alpine AS base

WORKDIR /usr/src/app

# Install system dependencies and clean up to reduce image size
RUN apk add --no-cache ffmpeg

COPY . .


RUN yarn install 

CMD [ "yarn", "dev" ]