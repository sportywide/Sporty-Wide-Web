FROM sportywide-base AS base

COPY ./packages/sw-shared $PROJECT_ROOT/packages/sw-shared/
COPY ./packages/sw-core $PROJECT_ROOT/packages/sw-core/
COPY ./packages/sw-schema $PROJECT_ROOT/packages/sw-schema/
COPY ./packages/sw-api $PROJECT_ROOT/packages/sw-api/
RUN cd $PROJECT_ROOT && npx lerna link

RUN mkdir /opt/scripts
COPY ./packages/sw-api/bin /opt/scripts
RUN dos2unix /opt/scripts/*.sh
RUN chmod a+x /opt/scripts/*.sh
ENTRYPOINT ["/opt/scripts/bootstrap.sh"]
CMD dev

WORKDIR $PROJECT_ROOT/packages/sw-api

FROM base AS prod
ENV NODE_ENV=production
RUN cd $PROJECT_ROOT && npm run install:dependencies
