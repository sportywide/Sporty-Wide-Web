#! /bin/bash

ssh-keygen -F gitlab.com || ssh-keyscan gitlab.com >>~/.ssh/known_hosts
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/sw_git
test ! -e sporty-wide-web && git clone git@gitlab.com:sporty-wide/sporty-wide-web.git
cd sporty-wide-web || exit
git pull origin master
SW_POSTGRES_USER=$(aws ssm get-parameter --region ap-southeast-2 --name "/sw/rds/username" | jq -r '.Parameter.Value')
SW_POSTGRES_PASSWORD=$(aws ssm get-parameter --region ap-southeast-2 --name "/sw/rds/password" --with-decryption | jq -r '.Parameter.Value')
SW_DB_ENDPOINT=$(aws ssm get-parameter --region ap-southeast-2 --name "/sw/rds/endpoint" | jq -r '.Parameter.Value')
docker run -v "$(pwd)"/sql:/flyway/sql sportywide/sportywide-flyway -url=jdbc:postgresql://${SW_DB_ENDPOINT}/sportywide -user=${SW_POSTGRES_USER} -password=${SW_POSTGRES_PASSWORD} -outOfOrder=true -mixed=true migrate
