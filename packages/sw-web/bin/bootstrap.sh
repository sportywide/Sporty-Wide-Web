#!/usr/bin/env bash

cd $PROJECT_ROOT && node /opt/app/bin/install.js sw-web && cd -

npm run "$@"
