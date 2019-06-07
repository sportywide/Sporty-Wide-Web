FROM sportywide-base

COPY --chown=sportywide:sportywide ./packages/sw-shared/package*.json $PROJECT_ROOT/packages/sw-shared/
COPY --chown=sportywide:sportywide ./packages/sw-schema/package*.json $PROJECT_ROOT/packages/sw-schema/
COPY --chown=sportywide:sportywide ./packages/sw-api/package*.json $PROJECT_ROOT/packages/sw-api/

RUN cd $PROJECT_ROOT && node /opt/app/bin/install.js

USER $USER

COPY --chown=sportywide:sportywide ./packages/sw-shared $PROJECT_ROOT/packages/sw-shared/
COPY --chown=sportywide:sportywide ./packages/sw-schema $PROJECT_ROOT/packages/sw-schema/
COPY --chown=sportywide:sportywide ./packages/sw-api $PROJECT_ROOT/packages/sw-api/

WORKDIR $PROJECT_ROOT/packages/sw-api

ENTRYPOINT ["/bin/sh", "bin/bootstrap.sh"]

CMD "dev"
