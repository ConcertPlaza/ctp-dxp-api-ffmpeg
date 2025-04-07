FROM node:lts-alpine

WORKDIR /usr/src/app

# Install system dependencies and clean up to reduce image size
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    curl \
    unixodbc \
    unixodbc-dev \
    libodbc1 \
    ffmpeg \  
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY . .


RUN yarn install --immutable

CMD [ "yarn", "dev" ]