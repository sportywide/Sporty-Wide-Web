#!/usr/bin/env bash
WEB_VERSION=$(./get-version sw-web)
cd ./elb/frontend || exit 1
START=$(date +%s)
VERSION=$(date +%s)
ZIP=$VERSION.zip
EB_BUCKET=sportywide-deployment
ENV_NAME=sw-frontend-prod
APP_NAME=sportywide

sed -e "s/<WEB_VERSION>/$WEB_VERSION/" Dockerrun.aws.json.template > Dockerrun.aws.json

zip -r $ZIP Dockerrun.aws.json

aws s3 cp $ZIP s3://$EB_BUCKET/frontend/$ZIP

aws elasticbeanstalk create-application-version --application-name $APP_NAME --version-label $VERSION --source-bundle S3Bucket=$EB_BUCKET,S3Key=frontend/$ZIP

aws elasticbeanstalk update-environment --environment-name $ENV_NAME --version-label $VERSION

END=`date +%s`

echo Deploy ended with success! Time elapsed: $((END - START)) seconds
