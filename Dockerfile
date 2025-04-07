FROM node:lts-alpine

WORKDIR /usr/src/app

# Install system dependencies and clean up to reduce image size
RUN apk add --no-cache ffmpeg

COPY . .


RUN yarn install --immutable

CMD [ "yarn", "dev" ]