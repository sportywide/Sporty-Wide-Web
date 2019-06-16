FROM node:10-alpine

ARG PUID=1024
ENV PUID ${PUID}
ARG PGID=1024
ENV PGID ${PGID}
ENV USER=sportywide
ENV GROUP=sportywide

USER root

RUN addgroup -S -g ${PGID} ${GROUP} && \
adduser -S -u ${PUID} -G ${GROUP} -D ${USER}

RUN mkdir -p /opt/app

ENV PROJECT_ROOT /opt/app

RUN chown $USER:$GROUP $PROJECT_ROOT

COPY --chown=sportywide:sportywide package*.json lerna.json tsconfig.json $PROJECT_ROOT/
COPY --chown=sportywide:sportywide bin $PROJECT_ROOT/bin
COPY --chown=sportywide:sportywide helpers $PROJECT_ROOT/helpers

USER $USER

WORKDIR $PROJECT_ROOT

RUN npm run install:dependencies

