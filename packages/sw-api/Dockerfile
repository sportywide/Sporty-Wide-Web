FROM sportywide/sportywide-base AS dev

COPY ./packages/sw-shared $PROJECT_ROOT/packages/sw-shared/
COPY ./packages/sw-core $PROJECT_ROOT/packages/sw-core/
COPY ./packages/sw-schema $PROJECT_ROOT/packages/sw-schema/
COPY ./packages/sw-api $PROJECT_ROOT/packages/sw-api/
RUN cd $PROJECT_ROOT && npx lerna link

CMD dev

WORKDIR $PROJECT_ROOT/packages/sw-api

FROM base AS build-prod
ENV NO_OPTIONAL 1
RUN cd $PROJECT_ROOT && npm run install:dependencies
RUN lerna run --stream build --scope sportywide-api
ENV NODE_ENV production
RUN cd $PROJECT_ROOT && rm -rf node_modules && lerna bootstrap -- --production --no-optional

FROM node:10-alpine AS prod
ENV NODE_ENV production
COPY --from=build-prod /opt/app/node_modules /opt/app/node_modules
COPY --from=build-prod /opt/app/packages/sw-api/dist /opt/app/dist
WORKDIR /opt/app
ENTRYPOINT ["node", "dist/main.js"]
