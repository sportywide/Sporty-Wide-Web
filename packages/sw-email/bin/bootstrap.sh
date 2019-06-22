#!/usr/bin/env bash

cd $PROJECT_ROOT && npm run install:dependencies && cd -

/usr/local/bin/wait && npm run "$@"
