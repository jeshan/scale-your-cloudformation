#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { CdkStack } = require('../lib/cdk-stack');

const app = new cdk.App();
new CdkStack(app);
