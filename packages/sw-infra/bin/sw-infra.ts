#!/usr/bin/env node
import 'source-map-support/register';
import { buildSwStack } from '../lib/sw-infra-stack';

buildSwStack().then(({ stackName }) => console.info(`Stack ${stackName} built finished`));
