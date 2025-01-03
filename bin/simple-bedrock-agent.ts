#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SimpleBedrockAgentStack } from '../lib/simple-bedrock-agent-stack';


const app = new cdk.App();
new SimpleBedrockAgentStack(app, 'SimpleBedrockAgentStack', {
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION 
  },
});
