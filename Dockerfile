FROM node:10-alpine

ARG PUID=1024
ENV PUID ${PUID}
ARG PGID=1024
ENV PGID ${PGID}
ENV USER=sportywide
ENV GROUP=sportywide

USER root

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
    
RUN addgroup -S -g ${PGID} ${GROUP} && \
adduser -S -u ${PUID} -G ${GROUP} -D ${USER}

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.5.0/wait /usr/local/bin/wait
RUN chmod +x /usr/local/bin/wait

RUN mkdir -p /opt/app

ENV PROJECT_ROOT /opt/app

RUN chown $USER:$GROUP $PROJECT_ROOT

RUN npm install -g ts-node@8.3.0 typescript@3.5.2

COPY --chown=sportywide:sportywide package*.json lerna.json tsconfig.json $PROJECT_ROOT/
COPY --chown=sportywide:sportywide bin $PROJECT_ROOT/bin
COPY --chown=sportywide:sportywide helpers $PROJECT_ROOT/helpers

USER $USER

WORKDIR $PROJECT_ROOT

RUN npm run install:dependencies

