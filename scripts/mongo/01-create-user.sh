#!/usr/bin/env bash

echo 'Creating application user and db'

mongo ${MONGO_INITDB_DATABASE} \
        --host localhost \
        --port 27017 \
        -u ${MONGO_INITDB_ROOT_USERNAME} \
        -p ${MONGO_INITDB_ROOT_PASSWORD} \
        --authenticationDatabase ${MONGO_INITDB_DATABASE} \
        --eval "db.createUser({user: '${SW_MONGO_USER}', pwd: '${SW_MONGO_PASSWORD}', roles:[{role:'dbOwner', db: '${SW_MONGO_DB}'}]});"