FROM sportywide/sportywide-base AS base

COPY ./packages/sw-shared $PROJECT_ROOT/packages/sw-shared/
COPY ./packages/sw-schema $PROJECT_ROOT/packages/sw-schema/
COPY ./packages/sw-core $PROJECT_ROOT/packages/sw-core/
COPY ./packages/sw-email $PROJECT_ROOT/packages/sw-email/
RUN cd $PROJECT_ROOT && npx lerna link

CMD "dev"

WORKDIR $PROJECT_ROOT/packages/sw-email

FROM base AS prod
ENV NODE_ENV=production
RUN cd $PROJECT_ROOT && npm run install:dependencies
