FROM node:10-alpine AS base

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

RUN chown -R $USER:$GROUP $PROJECT_ROOT

RUN npm install -g ts-node@8.3.0 typescript@3.5.2

COPY --chown=sportywide:sportywide package*.json lerna.json tsconfig.json $PROJECT_ROOT/
COPY --chown=sportywide:sportywide bin $PROJECT_ROOT/bin
COPY --chown=sportywide:sportywide helpers $PROJECT_ROOT/helpers

USER $USER

WORKDIR $PROJECT_ROOT

FROM base as dev
ENV NODE_ENV=development
COPY --chown=sportywide:sportywide ./packages/sw-shared/package*.json $PROJECT_ROOT/packages/sw-shared/
COPY --chown=sportywide:sportywide ./packages/sw-core/package*.json $PROJECT_ROOT/packages/sw-core/
COPY --chown=sportywide:sportywide ./packages/sw-web/package*.json $PROJECT_ROOT/packages/sw-web/
COPY --chown=sportywide:sportywide ./packages/sw-api/package*.json $PROJECT_ROOT/packages/sw-api/
COPY --chown=sportywide:sportywide ./packages/sw-email/package*.json $PROJECT_ROOT/packages/sw-email/
COPY --chown=sportywide:sportywide ./packages/sw-schema/package*.json $PROJECT_ROOT/packages/sw-schema/
RUN npm run install:dependencies

FROM base as prod
ENV NODE_ENV=production
RUN npm run install:dependencies

