FROM node:10

RUN apt update -y && apt install -y build-essential autoconf automake libjpeg-dev libpng-dev libtiff-dev

ADD package.json yarn.lock /app/

WORKDIR /app

ENV JOBS=max
RUN yarn

ADD . /app/
RUN yarn jest --version; yarn test
