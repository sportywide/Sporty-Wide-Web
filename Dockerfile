FROM node:10-alpine AS base

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
    
RUN apk add dos2unix --no-cache --repository http://dl-3.alpinelinux.org/alpine/edge/community/ --allow-untrusted

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.5.0/wait /usr/local/bin/wait
RUN chmod +x /usr/local/bin/wait

RUN mkdir -p /opt/app

ENV PROJECT_ROOT /opt/app

RUN npm install -g ts-node@8.3.0 typescript@3.5.2

COPY package*.json lerna.json tsconfig.json $PROJECT_ROOT/
COPY bin $PROJECT_ROOT/bin
COPY helpers $PROJECT_ROOT/helpers

WORKDIR $PROJECT_ROOT

FROM base as dev
ENV NODE_ENV=development
COPY ./packages/sw-shared/package*.json $PROJECT_ROOT/packages/sw-shared/
COPY ./packages/sw-core/package*.json $PROJECT_ROOT/packages/sw-core/
COPY ./packages/sw-web/package*.json $PROJECT_ROOT/packages/sw-web/
COPY ./packages/sw-api/package*.json $PROJECT_ROOT/packages/sw-api/
COPY ./packages/sw-email/package*.json $PROJECT_ROOT/packages/sw-email/
COPY ./packages/sw-schema/package*.json $PROJECT_ROOT/packages/sw-schema/
RUN NO_OPTIONAL=1 npm run install:dependencies

FROM base as prod
ENV NODE_ENV=production
RUN npm run install:dependencies

