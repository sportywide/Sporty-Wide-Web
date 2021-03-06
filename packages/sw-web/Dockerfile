FROM sportywide/sportywide-base AS build-prod
ENV NO_OPTIONAL 1

COPY ./packages/sw-shared/package*.json $PROJECT_ROOT/packages/sw-shared/
COPY ./packages/sw-web/package*.json $PROJECT_ROOT/packages/sw-web/

RUN cd $PROJECT_ROOT && npm run install:dependencies

COPY ./packages/sw-shared/ $PROJECT_ROOT/packages/sw-shared/
COPY ./packages/sw-web/ $PROJECT_ROOT/packages/sw-web/

RUN lerna run --stream build --scope sportywide-web

FROM sportywide/sportywide-base AS produles
ENV NODE_ENV production
COPY --from=build-prod /opt/app/package-lock.json $PROJECT_ROOT
COPY ./packages/sw-shared/package*.json $PROJECT_ROOT/packages/sw-shared/
COPY ./packages/sw-web/package*.json $PROJECT_ROOT/packages/sw-web/
RUN npm cache clean --force
RUN cd $PROJECT_ROOT && ts-node -T ./bin/install-hoist.ts

FROM node:12-alpine AS prod
ENV NODE_ENV production
RUN mkdir -p /opt/app
COPY --from=produles /opt/app/node_modules /opt/app/node_modules
COPY --from=build-prod /opt/app/packages/sw-web/next-build /opt/app/next-build
COPY --from=build-prod /opt/app/packages/sw-web/dist /opt/app/dist
COPY --from=build-prod /opt/app/packages/sw-web/src/public /opt/app/dist/public
COPY --from=build-prod /opt/app/packages/sw-web/next.config.js /opt/app/next.config.js
WORKDIR /opt/app
ENTRYPOINT ["node", "dist/main.js"]

FROM sportywide/sportywide-base AS dev

CMD "dev"
WORKDIR $PROJECT_ROOT/packages/sw-web
RUN cd $PROJECT_ROOT && npx lerna link
