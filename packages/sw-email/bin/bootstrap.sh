#!/bin/bash

cd "$PROJECT_ROOT" && npm run install:dependencies && cd - || exit

/usr/local/bin/wait && npm run "$@"
