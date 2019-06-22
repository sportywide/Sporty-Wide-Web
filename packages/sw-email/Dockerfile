FROM sportywide-base

COPY --chown=sportywide:sportywide ./packages/sw-shared/package*.json $PROJECT_ROOT/packages/sw-shared/
COPY --chown=sportywide:sportywide ./packages/sw-core/package*.json $PROJECT_ROOT/packages/sw-core/

RUN cd $PROJECT_ROOT && npm run install:dependencies

USER $USER

COPY --chown=sportywide:sportywide ./packages/sw-shared $PROJECT_ROOT/packages/sw-shared/
COPY --chown=sportywide:sportywide ./packages/sw-core $PROJECT_ROOT/packages/sw-core/

WORKDIR $PROJECT_ROOT/packages/sw-api

ENTRYPOINT ["/bin/sh", "bin/bootstrap.sh"]

CMD "dev"
