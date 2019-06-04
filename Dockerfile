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

COPY --chown=sportywide:sportywide package*.json lerna.json $PROJECT_ROOT/

USER $USER

WORKDIR $PROJECT_ROOT

RUN npm ci

