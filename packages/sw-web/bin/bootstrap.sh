#!/bin/bash

cd "$PROJECT_ROOT" && npm run install:dependencies && cd - || exit

npm run "$@"
