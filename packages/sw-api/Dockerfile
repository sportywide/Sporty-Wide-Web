FROM sportywide/sportywide-base AS build-prod
ENV NO_OPTIONAL 1
COPY ./packages/sw-shared/package*.json $PROJECT_ROOT/packages/sw-shared/
COPY ./packages/sw-core/package*.json $PROJECT_ROOT/packages/sw-core/
COPY ./packages/sw-schema/package*.json $PROJECT_ROOT/packages/sw-schema/
COPY ./packages/sw-api/package*.json $PROJECT_ROOT/packages/sw-api/
RUN cd $PROJECT_ROOT && npm run install:dependencies

COPY ./packages/sw-shared $PROJECT_ROOT/packages/sw-shared/
COPY ./packages/sw-core $PROJECT_ROOT/packages/sw-core/
COPY ./packages/sw-schema $PROJECT_ROOT/packages/sw-schema/
COPY ./packages/sw-api $PROJECT_ROOT/packages/sw-api/
RUN lerna run --stream build --scope sportywide-api

FROM sportywide/sportywide-base AS produles
ENV NODE_ENV production
COPY --from=build-prod /opt/app/package-lock.json $PROJECT_ROOT
COPY ./packages/sw-shared/package*.json $PROJECT_ROOT/packages/sw-shared/
COPY ./packages/sw-core/package*.json $PROJECT_ROOT/packages/sw-core/
COPY ./packages/sw-schema/package*.json $PROJECT_ROOT/packages/sw-schema/
COPY ./packages/sw-api/package*.json $PROJECT_ROOT/packages/sw-api/
RUN cd $PROJECT_ROOT && ts-node -T ./bin/install-hoist.ts

FROM node:12-alpine AS prod
ENV NODE_ENV production
COPY --from=produles /opt/app/node_modules /opt/app/node_modules
COPY --from=build-prod /opt/app/packages/sw-api/dist /opt/app/dist
WORKDIR /opt/app
ENTRYPOINT ["node", "dist/main.js"]

FROM sportywide/sportywide-base AS dev

COPY ./packages/sw-shared $PROJECT_ROOT/packages/sw-shared/
COPY ./packages/sw-core $PROJECT_ROOT/packages/sw-core/
COPY ./packages/sw-schema $PROJECT_ROOT/packages/sw-schema/
COPY ./packages/sw-api $PROJECT_ROOT/packages/sw-api/
RUN cd $PROJECT_ROOT && npx lerna link

CMD dev

WORKDIR $PROJECT_ROOT/packages/sw-api
