import * as cdk from 'aws-cdk-lib';
import { bedrock } from '@cdklabs/generative-ai-cdk-constructs';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

export class SimpleBedrockAgentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create Lambda function for addition
    const addFunction = new lambda.Function(this, 'AddFunction', {
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: 'index.lambda_handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda/add-numbers')),
    });

    // Create Bedrock Agent
    const agent = new bedrock.Agent(this, 'SimpleAgent', {
      name: 'simple-agent',
      foundationModel: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_HAIKU_V1_0,
      instruction: `You are a helpful assistant that performs mathematical calculations using provided actions.
        For ANY mathematical addition, you MUST use the add action from the math-operations action group.
        NEVER calculate numbers directly - always use the add action.
        When users ask for addition or use plus/더하기, you must:
        1. Extract the numbers
        2. Use the add action with these numbers
        3. Return the result from the action`,
      description: "A simple Bedrock agent for demonstration",
      enableUserInput: true,
      shouldPrepareAgent: true,
      aliasName: "latest",
    });

    const actionGroup = new bedrock.AgentActionGroup(this, "AdditionActionGroup", {
      actionGroupName: "math-operations",
      description: "Mathematical operations - must be used for ALL calculations. Direct calculation is not allowed.",
      actionGroupExecutor: {
        lambda: addFunction
      },
      actionGroupState: "ENABLED",
      apiSchema: bedrock.ApiSchema.fromAsset(path.join(__dirname, 'schemas/math-operations.yaml'))
    });

    agent.addActionGroup(actionGroup);

    // Output the Agent ID and Alias
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
