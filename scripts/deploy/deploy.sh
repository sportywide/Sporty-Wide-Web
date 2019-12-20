#!/usr/bin/env bash
START=$(date +%s)
VERSION=$(date +%s)
ZIP=$VERSION.zip
EB_BUCKET=sportywide-deployment
ENV_NAME=sportywide-prod
APP_NAME=sportywide
EMAIL_VERSION=$(./get-version sw-email)
WEB_VERSION=$(./get-version sw-web)
API_VERSION=$(./get-version sw-api)

sed -e "s/<EMAIL_VERSION>/$EMAIL_VERSION/" -e "s/<WEB_VERSION>/$WEB_VERSION/" -e "s/<API_VERSION>/$API_VERSION/" Dockerrun.aws.json.template > Dockerrun.aws.json

zip -r $ZIP Dockerrun.aws.json

aws s3 cp $ZIP s3://$EB_BUCKET/$ZIP

aws elasticbeanstalk create-application-version --application-name $APP_NAME --version-label $VERSION --source-bundle S3Bucket=$EB_BUCKET,S3Key=$ZIP

aws elasticbeanstalk update-environment --environment-name $ENV_NAME --version-label $VERSION

END=`date +%s`

echo Deploy ended with success! Time elapsed: $((END - START)) seconds
