FROM sportywide-base

COPY --chown=sportywide:sportywide ./packages/sw-shared/package*.json $PROJECT_ROOT/packages/sw-shared/
COPY --chown=sportywide:sportywide ./packages/sw-web/package*.json $PROJECT_ROOT/packages/sw-web/

RUN cd $PROJECT_ROOT && npm run install:dependencies

USER $USER

COPY --chown=sportywide:sportywide ./packages/sw-shared $PROJECT_ROOT/packages/sw-shared/
COPY --chown=sportywide:sportywide ./packages/sw-web $PROJECT_ROOT/packages/sw-web/

WORKDIR $PROJECT_ROOT/packages/sw-web

ENTRYPOINT ["/bin/sh", "bin/bootstrap.sh"]
CMD "dev"
