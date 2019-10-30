#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { SwInfraStack } from '../lib/sw-infra-stack';

const app = new cdk.App();
new SwInfraStack(app, 'swStack');
