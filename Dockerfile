FROM oven/bun:latest

WORKDIR /usr/src/app

# Install system dependencies and clean up to reduce image size
RUN apk add --no-cache ffmpeg

COPY . .


RUN bun install

CMD [ "bun", "dev" ]