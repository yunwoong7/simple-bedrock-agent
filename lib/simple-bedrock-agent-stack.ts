import * as cdk from 'aws-cdk-lib';
import { bedrock } from '@cdklabs/generative-ai-cdk-constructs';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

export class SimpleBedrockAgentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Add Function Lambda
    const addFunction = new lambda.Function(this, 'AddFunction', {
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: 'index.lambda_handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda/add-numbers')),
    });

    // requests Layer 생성
    const requestsLayer = new lambda.LayerVersion(this, 'RequestsLayer', {
      code: lambda.Code.fromAsset('lambda-layer/requests'),
      compatibleRuntimes: [lambda.Runtime.PYTHON_3_12],
      description: 'Requests module layer',
    });

    // Search Function Lambda with Layer
    const searchFunction = new lambda.Function(this, 'SearchFunction', {
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: 'index.lambda_handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda/brave-search')),
      layers: [requestsLayer],  // Layer 추가
      environment: {
        BRAVE_API_KEY: process.env.BRAVE_API_KEY || ''
      }
    });

    // Create Bedrock Agent
    const agent = new bedrock.Agent(this, 'SimpleAgent', {
      foundationModel: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_HAIKU_V1_0,
      instruction: `You are a helpful assistant that can perform mathematical calculations and web searches.
        For ANY mathematical addition, use the add action from the math-operations action group.
        For web searches, use the search action from the search-operations action group.
        NEVER calculate numbers directly - always use the add action.
        When users ask for search or "검색", use the search action to find information.`,
      description: "A simple Bedrock agent for demonstration",
      enableUserInput: true,
      aliasName: "latest"
    });

    // Math Operations Action Group
    const mathActionGroup = new bedrock.AgentActionGroup(this, "MathActionGroup", {
      actionGroupName: "math-operations",
      description: "Mathematical operations like addition",
      actionGroupExecutor: {
        lambda: addFunction
      },
      actionGroupState: "ENABLED",
      apiSchema: bedrock.ApiSchema.fromAsset(path.join(__dirname, 'schemas/math-operations.yaml'))
    });

    // Search Operations Action Group
    const searchActionGroup = new bedrock.AgentActionGroup(this, "SearchActionGroup", {
      actionGroupName: "search-operations",
      description: "Web search operations using Brave Search",
      actionGroupExecutor: {
        lambda: searchFunction
      },
      actionGroupState: "ENABLED",
      apiSchema: bedrock.ApiSchema.fromAsset(path.join(__dirname, 'schemas/search-operations.yaml'))
    });

    // Add Action Groups to Agent
    agent.addActionGroup(mathActionGroup);
    agent.addActionGroup(searchActionGroup);

    // Output the Agent ID and Alias ID
    new cdk.CfnOutput(this, 'AgentId', {
      value: agent.agentId,
      description: 'The ID of the Bedrock Agent'
    });

    new cdk.CfnOutput(this, 'AgentAliasId', {
      value: agent.aliasId ?? 'default-alias-id',
      description: 'The alias ID of the Bedrock Agent'
    });
  }
}
