FROM sportywide-base

COPY --chown=sportywide:sportywide ./packages/sw-shared/package*.json $PROJECT_ROOT/packages/sw-shared/
COPY --chown=sportywide:sportywide ./packages/sw-core/package*.json $PROJECT_ROOT/packages/sw-core/
COPY --chown=sportywide:sportywide ./packages/sw-email/package*.json $PROJECT_ROOT/packages/sw-email/

RUN cd $PROJECT_ROOT && npm run install:dependencies

USER $USER

COPY --chown=sportywide:sportywide ./packages/sw-shared $PROJECT_ROOT/packages/sw-shared/
COPY --chown=sportywide:sportywide ./packages/sw-core $PROJECT_ROOT/packages/sw-core/
COPY --chown=sportywide:sportywide ./packages/sw-email $PROJECT_ROOT/packages/sw-email/

WORKDIR $PROJECT_ROOT/packages/sw-email

ENTRYPOINT ["/bin/sh", "bin/bootstrap.sh"]

CMD "dev"
