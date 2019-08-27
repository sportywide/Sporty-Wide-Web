FROM node:10-alpine AS node

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh curl jq
    
RUN apk add dos2unix --no-cache --repository http://dl-3.alpinelinux.org/alpine/edge/community/ --allow-untrusted

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.5.0/wait /usr/local/bin/wait
RUN chmod +x /usr/local/bin/wait

RUN npm install -g ts-node@8.3.0 typescript@3.4.5 lerna@3.16.4

FROM node as base

RUN mkdir -p /opt/app

ENV PROJECT_ROOT /opt/app

COPY package*.json lerna.json *.ts *.js tsconfig.json $PROJECT_ROOT/
COPY bin $PROJECT_ROOT/bin
COPY helpers $PROJECT_ROOT/helpers

RUN mkdir -p /opt/scripts

COPY ./bin/bootstrap.sh /opt/scripts/
RUN dos2unix /opt/scripts/*.sh
RUN chmod a+x /opt/scripts/*.sh
ENTRYPOINT ["/opt/scripts/bootstrap.sh"]

WORKDIR $PROJECT_ROOT

FROM base as prod
ENV NODE_ENV=production
RUN npm run install:dependencies

