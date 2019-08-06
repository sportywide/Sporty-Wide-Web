FROM sportywide-base AS base

USER $USER

COPY --chown=sportywide:sportywide ./packages/sw-shared $PROJECT_ROOT/packages/sw-shared/
COPY --chown=sportywide:sportywide ./packages/sw-web $PROJECT_ROOT/packages/sw-web/
RUN cd $PROJECT_ROOT && npx lerna link
WORKDIR $PROJECT_ROOT/packages/sw-web

ENTRYPOINT ["/bin/sh", "bin/bootstrap.sh"]
CMD "dev"

FROM base AS prod
RUN cd $PROJECT_ROOT && npm run install:dependencies
