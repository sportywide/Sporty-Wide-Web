#!/usr/bin/env bash

cd $PROJECT_ROOT && npm run install:dependencies && cd -

npm run "$@"
